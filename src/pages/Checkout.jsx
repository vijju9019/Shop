import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth, API_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { CreditCard, ShieldCheck, ArrowLeft, Sparkles, User, ExternalLink } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [discordUsername, setDiscordUsername] = useState(user?.discordUsername || '');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Mock Sandbox UI state
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockOrderData, setMockOrderData] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!discordUsername.trim()) {
      showToast('Discord Username is required for service delivery!', 'error');
      return;
    }

    try {
      setLoading(true);

      // 1. Create order on backend
      const { data } = await axios.post(`${API_URL}/orders`, {
        orderItems: cartItems,
        discordUsername: discordUsername.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim()
      });

      const { order, razorpayKeyId, isMock } = data;

      // 2. Route based on sandbox vs production
      if (isMock) {
        // Mock Sandbox payment modal
        setMockOrderData(order);
        setLoading(false);
        setShowMockModal(true);
      } else {
        // Open standard Razorpay Checkout Overlay
        const options = {
          key: razorpayKeyId,
          amount: Math.round(order.totalAmount * 100),
          currency: 'INR',
          name: 'Nitro Hub',
          description: `Fulfillment to @${discordUsername}`,
          image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100&h=100&fit=crop',
          order_id: order.razorpayOrderId,
          handler: async (response) => {
            try {
              setLoading(true);
              
              // Verify signature on backend
              const verifyRes = await axios.post(`${API_URL}/orders/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              showToast('Payment successful!', 'success');
              clearCart();
              navigate(`/success?orderId=${verifyRes.data.order._id}`);
            } catch (err) {
              console.error('Signature verification failed:', err);
              showToast(err.response?.data?.message || 'Payment verification failed', 'error');
              setLoading(false);
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
          },
          theme: {
            color: '#5865F2', // Discord Blurple
          },
          modal: {
            ondismiss: () => {
              showToast('Payment cancelled by user', 'info');
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (err) {
      console.error('Checkout error:', err);
      showToast(err.response?.data?.message || 'Error processing checkout', 'error');
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (success) => {
    setShowMockModal(false);
    setLoading(true);

    if (!success) {
      showToast('Payment simulation failed', 'error');
      setLoading(false);
      return;
    }

    try {
      // Call mock verification on backend
      const verifyRes = await axios.post(`${API_URL}/orders/verify`, {
        razorpay_order_id: mockOrderData.razorpayOrderId,
        simulateSuccess: true
      });

      showToast('Mock Payment Verified!', 'success');
      clearCart();
      navigate(`/success?orderId=${verifyRes.data.order._id}`);
    } catch (err) {
      console.error('Mock signature verification failed:', err);
      showToast('Mock Payment verification failed', 'error');
      setLoading(false);
    }
  };

  const handleManualPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast('Please enter a valid Transaction ID or UTR Reference number.', 'error');
      return;
    }

    setShowMockModal(false);
    setLoading(true);

    try {
      // Call manual verification on backend
      const verifyRes = await axios.post(`${API_URL}/orders/verify`, {
        razorpay_order_id: mockOrderData.razorpayOrderId,
        isManual: true,
        manualPaymentId: transactionId.trim()
      });

      showToast('Payment details submitted! Awaiting admin verification.', 'success');
      clearCart();
      navigate(`/success?orderId=${verifyRes.data.order._id}`);
    } catch (err) {
      console.error('Manual payment submission failed:', err);
      showToast('Failed to submit manual payment reference.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-8 relative">
      {loading && <Loading fullPage />}

      {/* Back to Cart */}
      <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Checkout Details</h1>
        <p className="text-gray-400 text-sm">
          Please input your Discord information. Order fulfillment will be sent to this handle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Checkout Form */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-discord-blurple" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">FullName</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  placeholder="Aria Jenkins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  placeholder="aria@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-discord-yellow uppercase tracking-wider mb-2 flex items-center gap-1">
                Discord Username (Required) ⚠️
              </label>
              <input
                type="text"
                required
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm font-semibold border-discord-yellow/30"
                placeholder="aria.dev#0000 or aria_dev"
              />
              <span className="text-[10px] text-gray-400 block mt-1.5 leading-relaxed">
                Ensure this handle matches your Discord profile exactly. We will search for this user to deliver Nitro codes or invite you/our bot to apply Server Boosts.
              </span>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h2 className="font-bold text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-discord-green" />
              Payment Gateway Options
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              We leverage Razorpay standard Checkout for cards, net banking, mobile wallets, and direct Indian UPI (PhonePe, Google Pay, Paytm, BHIM).
            </p>
            <button
              type="submit"
              className="mt-2 py-4 bg-discord-green hover:bg-[#23d160] active:scale-95 text-discord-darkest font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 text-base shadow-xl shadow-discord-green/15"
            >
              Pay Securely via Razorpay
            </button>
          </div>
        </form>

        {/* Order Breakdown sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
            <h2 className="font-bold text-white text-lg border-b border-white/5 pb-3">Review Items</h2>

            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-discord-blurple/10 text-discord-blurple px-2 py-0.5 rounded font-bold">x{item.qty}</span>
                    <span className="text-white font-medium truncate max-w-[180px]">{item.name}</span>
                  </div>
                  <span className="text-gray-300 font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 mt-1 flex justify-between items-baseline">
              <span className="font-bold text-white text-base">Grand Total</span>
              <span className="font-extrabold text-2xl text-discord-blurple">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-discord-darker/40 p-4 rounded-2xl border border-white/5 text-xs text-gray-400">
            <ShieldCheck className="w-8 h-8 text-discord-green flex-shrink-0" />
            <p>
              By clicking checkout, you verify the information entered is accurate. Digital assets are processed within minutes.
            </p>
          </div>
        </div>

      </div>

      {/* Razorpay UPI/Manual Payment Modal Overlay */}
      {showMockModal && (
        <div className="fixed inset-0 bg-discord-darkest/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full bg-discord-darker rounded-3xl border border-discord-blurple/30 shadow-2xl p-6 flex flex-col gap-5 text-center my-8 animate-scale-in">
            
            <div className="flex justify-center">
              <div className="bg-discord-blurple/15 p-3 rounded-full text-discord-blurple border border-discord-blurple/25">
                <CreditCard className="w-8 h-8" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold text-white">Razorpay UPI Checkout</h2>
              <p className="text-gray-400 text-xs leading-relaxed px-2">
                Pay instantly using our secure personal Razorpay UPI channel. Follow the steps below to complete fulfillment.
              </p>
            </div>

            {/* Order total amount badge */}
            <div className="bg-discord-darkest p-4 rounded-2xl border border-white/5 text-left text-xs flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-white font-mono font-bold text-[11px]">{mockOrderData?.razorpayOrderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discord Handle:</span>
                <span className="text-discord-yellow font-bold">@{discordUsername}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2.5 border-t border-white/5">
                <span className="text-gray-300 font-semibold">Amount to Transfer:</span>
                <span className="text-discord-green font-extrabold text-lg">₹{mockOrderData?.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Step 1: QR & Link */}
            <div className="flex flex-col items-center gap-3 bg-discord-darker p-3 rounded-2xl border border-white/5">
              <div className="bg-white p-2 rounded-xl border border-white/10 shadow-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=32-34-37&bgcolor=255-255-255&data=${encodeURIComponent('https://razorpay.me/@kshitijrajkumardinni')}`} 
                  alt="Razorpay UPI QR Code" 
                  className="w-[140px] h-[140px] select-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 max-w-[280px]">
                Scan QR with PhonePe, GPay, Paytm, or BHIM to pay <strong>₹{mockOrderData?.totalAmount.toFixed(2)}</strong>.
              </p>

              <a
                href="https://razorpay.me/@kshitijrajkumardinni"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white font-extrabold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Razorpay Payment Page
              </a>
            </div>

            {/* Step 2: Verification Input */}
            <form onSubmit={handleManualPaymentSubmit} className="flex flex-col gap-3 text-left border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  Transaction ID / UTR Reference 🔑
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                  placeholder="e.g. 12-digit UPI UTR or Razorpay ID"
                />
                <span className="text-[9px] text-gray-500 leading-normal">
                  Found on your UPI receipt. Order delivery starts once our finance agent approves this reference.
                </span>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowMockModal(false)}
                  className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-bold rounded-xl transition-all text-xs border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-discord-green hover:bg-[#4dd278] active:scale-95 text-discord-darkest font-extrabold rounded-xl transition-all text-xs shadow-lg shadow-discord-green/15 flex items-center justify-center gap-1"
                >
                  Submit Payment Details
                </button>
              </div>
            </form>

            {/* Developer Sandbox Bypass Link */}
            <div className="text-[10px] text-gray-500 border-t border-white/5 pt-2">
              Developer?{' '}
              <button
                type="button"
                onClick={() => handleSimulatePayment(true)}
                className="text-discord-blurple hover:underline font-bold"
              >
                Simulate Instant Success (Auto-Verify)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
