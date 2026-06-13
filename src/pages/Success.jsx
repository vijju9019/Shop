import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import Loading from '../components/Loading';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);

  const getWhatsAppUrl = (id) => {
    const message = `Payment has been done. My Order ID is ${id}. Please process my Discord purchase.`;
    return `https://wa.me/919272501980?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order on success:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Automatic WhatsApp Redirection countdown
  useEffect(() => {
    if (!loading && order) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect
            window.location.href = getWhatsAppUrl(order._id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, order]);

  if (loading) return <Loading fullPage />;

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <span className="text-5xl">⚠️</span>
        <h1 className="text-2xl font-bold text-white">Order Details Not Found</h1>
        <p className="text-gray-400 text-sm">
          Something went wrong loading your receipt. Please inspect your profile for transaction histories.
        </p>
        <Link to="/" className="px-6 py-2.5 bg-discord-blurple text-white font-bold rounded-lg text-sm">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-discord-green/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="p-4 bg-discord-green/10 rounded-full text-discord-green border border-discord-green/30 animate-pulse">
          <CheckCircle2 className="w-16 h-16 stroke-[1.5px]" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          {order.paymentStatus === 'paid' ? 'Order Paid Successfully!' : 'Order Placed Successfully!'}
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {order.paymentStatus === 'paid'
            ? 'We have received your payment. Your receipt and fulfillment coordinates have been verified.'
            : 'Your payment reference has been submitted. Fulfillment will begin as soon as our admin verifies the transfer.'}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="glass p-6 rounded-2xl border border-white/5 w-full text-left max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order Reference</span>
          <span className="font-mono text-sm text-discord-blurple font-bold uppercase">{order._id}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Total Charged:</span>
          <span className="font-extrabold text-white text-base">₹{order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Discord Target:</span>
          <span className="text-discord-yellow font-bold">@{order.customerDetails?.discordUsername}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Payment Status:</span>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase tracking-wider border ${
            order.paymentStatus === 'paid'
              ? 'bg-discord-green/10 text-discord-green border-discord-green/20'
              : order.paymentStatus === 'failed'
              ? 'bg-discord-red/10 text-discord-red border-discord-red/20'
              : 'bg-discord-yellow/10 text-discord-yellow border-discord-yellow/20'
          }`}>
            {order.paymentStatus}
          </span>
        </div>

        {/* Order item details */}
        <div className="mt-2 pt-3 border-t border-white/5">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Purchased Items</p>
          <div className="flex flex-col gap-1.5">
            {order.orderItems?.map((item) => (
              <div key={item._id} className="text-xs text-gray-300 flex justify-between font-semibold">
                <span>{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                <span>₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redirect Indicator */}
      <div className="bg-discord-darker/60 border border-discord-green/20 rounded-2xl p-5 w-full max-w-lg flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold text-gray-300 leading-relaxed">
          Redirecting you to WhatsApp in <span className="text-discord-green font-extrabold text-base">{countdown}</span> seconds to complete fulfillment processing...
        </p>
        
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-discord-green transition-all duration-1000 ease-linear" 
            style={{ width: `${(countdown / 3) * 100}%` }}
          />
        </div>

        <a
          href={getWhatsAppUrl(order._id)}
          className="mt-2 px-6 py-3.5 bg-discord-green hover:bg-[#4dd278] active:scale-95 text-discord-darkest font-extrabold rounded-xl transition-all shadow-lg shadow-discord-green/20 flex items-center gap-2 text-sm justify-center w-full"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          Complete on WhatsApp Now
        </a>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-4">
        <ShoppingBag className="w-4 h-4" />
        Want to shop more?
        <Link to="/shop" className="text-discord-blurple hover:underline font-bold">
          Return to Shop
        </Link>
      </div>

    </div>
  );
};

export default Success;
