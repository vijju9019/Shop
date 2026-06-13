import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import sendOrderConfirmationEmail from '../utils/email.js';
import sendAdminNotification from '../utils/adminNotification.js';

const router = express.Router();

// Initialize Razorpay Instance
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

const getRazorpayInstance = () => {
  if (!keyId || !keySecret || keyId === 'dummy' || keySecret === 'dummy') {
    return null;
  }
  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    return null;
  }
};

// @desc    Create a new order and generate Razorpay Order ID
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, discordUsername, customerName, customerEmail } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  if (!discordUsername) {
    return res.status(400).json({ message: 'Discord username is required for fulfillment' });
  }

  try {
    // 1. Calculate and verify totals on backend
    let totalAmount = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      
      const itemPrice = dbProduct.price;
      const itemQty = Number(item.qty) || 1;
      
      totalAmount += itemPrice * itemQty;
      verifiedOrderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        qty: itemQty,
        price: itemPrice,
      });
    }

    // 2. Try to generate Razorpay order
    const razorpay = getRazorpayInstance();
    let razorpayOrderId = '';

    if (razorpay) {
      try {
        const options = {
          amount: Math.round(totalAmount * 100), // in Paisa
          currency: 'INR',
          receipt: `receipt_order_${Date.now()}`,
        };
        const rzpOrder = await razorpay.orders.create(options);
        razorpayOrderId = rzpOrder.id;
      } catch (err) {
        console.error('Razorpay Order Creation Error:', err);
        // Fail if keys exist but API call fails
        return res.status(500).json({ message: 'Razorpay integration error', error: err.message });
      }
    } else {
      // In development mode with dummy keys, generate a local simulated Order ID
      console.log('--- Razorpay Keys NOT configured (or dummy). Operating in MOCK mode ---');
      razorpayOrderId = `mock_rzp_${crypto.randomBytes(8).toString('hex')}`;
    }

    // 3. Save Order inside Database as Pending
    const order = new Order({
      user: req.user._id,
      customerDetails: {
        name: customerName || req.user.name,
        email: customerEmail || req.user.email,
        discordUsername,
      },
      orderItems: verifiedOrderItems,
      totalAmount,
      razorpayOrderId,
      paymentStatus: 'pending',
    });

    const createdOrder = await order.save();

    // 4. Return order metadata and keyId so frontend can trigger payment modal
    res.status(201).json({
      order: createdOrder,
      razorpayKeyId: keyId || 'dummy_key',
      isMock: !razorpay, // Tell frontend it can simulate payment success if keys are dummy
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @desc    Verify Razorpay payment signature or simulate success
// @route   POST /api/orders/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, simulateSuccess, isManual, manualPaymentId } = req.body;

  try {
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Handle Manual Verification Submission (Razorpay.me UPI flow)
    if (isManual) {
      order.paymentStatus = 'pending';
      order.orderStatus = 'pending'; // Stays pending/awaiting verification
      order.razorpayPaymentId = manualPaymentId || 'unspecified_ref';
      order.razorpaySignature = 'manual_submission';
      
      const updatedOrder = await order.save();

      // Dispatch admin alert asynchronously
      sendAdminNotification(updatedOrder).catch(console.error);

      return res.json({
        message: 'Payment details submitted for manual verification',
        order: updatedOrder,
      });
    }

    const razorpay = getRazorpayInstance();

    // Verification Logic
    let isPaymentValid = false;

    if (razorpay) {
      // Real Verification
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(text)
        .digest('hex');

      isPaymentValid = expectedSignature === razorpay_signature;
    } else {
      // Mock Verification for Sandbox
      if (simulateSuccess && razorpay_order_id.startsWith('mock_rzp_')) {
        isPaymentValid = true;
      }
    }

    if (isPaymentValid) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'processing';
      order.razorpayPaymentId = razorpay_payment_id || `mock_pay_${crypto.randomBytes(8).toString('hex')}`;
      order.razorpaySignature = razorpay_signature || 'mock_signature';
      order.completedAt = Date.now();

      const updatedOrder = await order.save();

      // Dispatch order confirmation email and admin alert asynchronously
      sendOrderConfirmationEmail(updatedOrder).catch(console.error);
      sendAdminNotification(updatedOrder).catch(console.error);

      res.json({
        message: 'Payment verification successful',
        order: updatedOrder,
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('My orders fetch error:', error);
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
});

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Users can only view their own orders; Admin can view any order
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Fetch order details error:', error);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
});

// @desc    Fetch all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
});

// @desc    Update order statuses
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      let becamePaid = false;
      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) {
        if (paymentStatus === 'paid' && order.paymentStatus !== 'paid') {
          becamePaid = true;
        }
        order.paymentStatus = paymentStatus;
        if (paymentStatus === 'paid' && !order.completedAt) {
          order.completedAt = Date.now();
        }
      }

      const updatedOrder = await order.save();

      if (becamePaid) {
        sendOrderConfirmationEmail(updatedOrder).catch(console.error);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
});

// @desc    Get Admin Metrics and Stats
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get('/admin/stats/dashboard', protect, admin, async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments({});
    
    // Revenue calculations (paid only)
    const paidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingFulfillCount = await Order.countDocuments({ orderStatus: 'processing' }); // processing implies paid, awaiting fulfillment
    const completedFulfillCount = await Order.countDocuments({ orderStatus: 'completed' });

    // Customer count
    const totalCustomersCount = await User.countDocuments({ role: 'user' });

    // Category distribution
    // Let's count products sold
    let nitroCount = 0;
    let boostCount = 0;

    for (const order of paidOrders) {
      for (const item of order.orderItems) {
        // we can fetch item category, let's classify by name
        if (item.name.toLowerCase().includes('nitro')) {
          nitroCount += item.qty;
        } else if (item.name.toLowerCase().includes('boost')) {
          boostCount += item.qty;
        }
      }
    }

    res.json({
      metrics: {
        totalOrders: totalOrdersCount,
        totalRevenue,
        pendingFulfillment: pendingFulfillCount,
        completedFulfillment: completedFulfillCount,
        totalCustomers: totalCustomersCount,
      },
      distribution: {
        nitro: nitroCount,
        boost: boostCount,
      },
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard statistics' });
  }
});

export default router;
