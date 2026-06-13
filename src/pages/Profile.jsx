import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { User, Lock, Clock, MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [discordUsername, setDiscordUsername] = useState(user?.discordUsername || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchMyOrders = async () => {
      try {
        setLoadingOrders(true);
        const { data } = await axios.get(`${API_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error('Error fetching profile orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    try {
      setSubmittingProfile(true);
      const updateData = { name, email, discordUsername };
      if (password) updateData.password = password;

      const res = await updateProfile(updateData);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
        setPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating profile settings', 'error');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const getWhatsAppUrl = (id) => {
    const message = `Payment has been done. My Order ID is ${id}. Please process my Discord purchase.`;
    return `https://wa.me/919272501980?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">My Account</h1>
        <p className="text-gray-400 text-sm">
          Manage your account profile parameters, credentials, and review past order receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Details Edit Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <form onSubmit={handleProfileSubmit} className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4 relative">
            {submittingProfile && <Loading />}
            
            <h2 className="font-bold text-white text-lg border-b border-white/5 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-discord-blurple" />
              Account Settings
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-discord-yellow uppercase tracking-wider mb-2">
                Fulfillment Discord Username
              </label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-semibold border-discord-yellow/20"
                placeholder="discord_user"
              />
            </div>

            <div className="border-t border-white/5 my-2"></div>

            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-discord-red" />
              Update Password (Leave blank to keep same)
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-3 bg-discord-blurple hover:bg-[#4752c4] text-white font-bold rounded-xl transition-all active:scale-95 text-sm"
            >
              Save Account Changes
            </button>
          </form>
        </div>

        {/* Order History Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
            <h2 className="font-bold text-white text-lg border-b border-white/5 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-discord-green" />
              Transaction & Order History
            </h2>

            {loadingOrders ? (
              <Loading />
            ) : orders.length === 0 ? (
              <div className="text-center py-12 flex flex-col gap-3 items-center">
                <span className="text-4xl">🧾</span>
                <p className="text-gray-400 text-sm">No transaction orders logged yet.</p>
                <Link to="/shop" className="text-xs text-discord-blurple font-bold hover:underline">
                  Visit the Shop
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-4 rounded-xl bg-discord-darker/60 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-discord-blurple">
                          #{ord._id.toString().substring(0, 8).toUpperCase()}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="text-xs font-semibold text-gray-300">
                        {ord.orderItems?.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                      </div>

                      <div className="flex gap-2.5 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-discord-green/10 text-discord-green border-emerald-500/20'
                            : ord.paymentStatus === 'failed'
                            ? 'bg-discord-red/10 text-discord-red border-rose-500/20'
                            : 'bg-discord-yellow/10 text-discord-yellow border-amber-500/20'
                        }`}>
                          Payment: {ord.paymentStatus}
                        </span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          ord.orderStatus === 'completed'
                            ? 'bg-discord-green/10 text-discord-green border-emerald-500/20'
                            : ord.orderStatus === 'processing'
                            ? 'bg-discord-blurple/10 text-discord-blurple border-indigo-500/20'
                            : 'bg-white/5 text-gray-400 border-white/10'
                        }`}>
                          Status: {ord.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto gap-2 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                      <span className="font-extrabold text-white text-base">
                        ₹{ord.totalAmount.toFixed(2)}
                      </span>
                      
                      {ord.paymentStatus === 'paid' && ord.orderStatus !== 'completed' && (
                        <a
                          href={getWhatsAppUrl(ord._id)}
                          className="px-3 py-1.5 bg-discord-green hover:bg-[#4dd278] text-discord-darkest font-extrabold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-inner"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          WhatsApp
                        </a>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
