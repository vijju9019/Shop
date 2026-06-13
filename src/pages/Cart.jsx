import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, ArrowLeft, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!user) {
      showToast('Please sign in to proceed to checkout!', 'warning');
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-discord-chat border border-white/5 flex items-center justify-center text-4xl shadow-inner">
          🛒
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Your Cart is Empty</h1>
          <p className="text-gray-400 text-sm max-w-sm">
            Looks like you haven't added any services yet. Explore our shop to find the best Discord upgrades!
          </p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-discord-blurple/25"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-discord-blurple" />
          Shopping Cart
        </h1>
        <p className="text-gray-400 text-sm">
          Review your items, adjust quantities, and proceed to our secure checkout page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between transition-all hover:border-white/10"
            >
              
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-xl bg-discord-chat overflow-hidden flex-shrink-0 relative border border-white/5">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight hover:text-discord-blurple transition-colors">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Billing: {item.duration}
                  </p>
                </div>
              </div>

              {/* Quantity Selector, Price, and Remove */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                
                {/* Qty update */}
                <div className="flex items-center gap-1 bg-discord-chat p-0.5 rounded-lg border border-white/5">
                  <button
                    onClick={() => updateQty(item.product, item.qty - 1)}
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-white">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.product, item.qty + 1)}
                    className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-lg flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <p className="font-extrabold text-white text-base">₹{(item.price * item.qty).toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500">₹{item.price} each</p>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => {
                    removeFromCart(item.product);
                    showToast(`${item.name} removed from cart`, 'info');
                  }}
                  className="p-2.5 text-gray-400 hover:text-discord-red hover:bg-discord-red/10 rounded-lg transition-all"
                  title="Remove Item"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

              </div>

            </div>
          ))}

          {/* Continue Shopping */}
          <Link to="/shop" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit mt-2">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
            <h2 className="font-bold text-white text-lg border-b border-white/5 pb-3">Order Summary</h2>
            
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({cartCount} items)</span>
                <span className="text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Fulfillment Fee</span>
                <span className="text-discord-green font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST / Taxes</span>
                <span className="text-discord-green font-semibold">₹0.00 (Inc.)</span>
              </div>
              
              <div className="border-t border-white/5 my-2"></div>
              
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-white text-base">Total Price</span>
                <span className="font-extrabold text-2xl text-discord-blurple">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white font-bold rounded-xl transition-all shadow-xl shadow-discord-blurple/25 flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Safe Check banner */}
          <div className="flex items-center gap-3 bg-discord-darker/40 p-4 rounded-2xl border border-white/5 text-xs text-gray-400">
            <ShieldCheck className="w-8 h-8 text-discord-green flex-shrink-0" />
            <p>
              Payments processed securely using Razorpay encryption. Direct UPI handles GPay, PhonePe, Paytm, and BHIM automatically.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
