import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { Sparkles, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { user, login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast('All standard fields are required!', 'error');
      return;
    }

    if (!isLogin && !name.trim()) {
      showToast('Name is required for registration!', 'error');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        // Log in
        const res = await login(email, password);
        if (res.success) {
          showToast('Welcome back to Nitro Hub!', 'success');
          navigate(redirect ? `/${redirect}` : '/');
        } else {
          showToast(res.message, 'error');
        }
      } else {
        // Sign up
        const res = await register(name, email, password, discordUsername);
        if (res.success) {
          showToast('Account created successfully!', 'success');
          navigate(redirect ? `/${redirect}` : '/');
        } else {
          showToast(res.message, 'error');
        }
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      showToast('An unexpected authentication error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16 relative flex items-center justify-center min-h-[75vh]">
      {loading && <Loading fullPage />}
      
      {/* Glow Backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-discord-blurple/15 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="glass p-8 rounded-3xl border border-white/10 w-full shadow-2xl flex flex-col gap-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="flex justify-center mb-1">
            <div className="bg-discord-blurple p-3 rounded-2xl text-white shadow-lg">
              <Sparkles className="w-6 h-6 fill-current" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-xs text-gray-400">
            {isLogin ? 'We are so excited to see you again!' : 'Join Nitro Hub today and get premium services!'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-discord-chat p-1 rounded-xl border border-white/5">
          <button
            onClick={() => {
              setIsLogin(true);
              setLoading(false);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              isLogin ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setLoading(false);
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              !isLogin ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">FullName</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="Kshitij Sharma"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                placeholder="email@example.com"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Discord Handle (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
                  placeholder="discord_ninja"
                />
                <span className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-xs">@</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-10 py-3 rounded-xl text-sm"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 py-3.5 bg-discord-blurple hover:bg-[#4752c4] text-white font-bold rounded-xl transition-all shadow-lg shadow-discord-blurple/25 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="text-center mt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-discord-blurple hover:underline font-semibold"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Log In'}
          </button>
        </div>

      </div>

    </div>
  );
};

export default Auth;
