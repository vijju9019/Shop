import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Phone, Key } from 'lucide-react';

const Auth = () => {
  const { user, login, register, sendOtp, verifyOtp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'otp'
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSandbox, setIsSandbox] = useState(false);
  const [sandboxOtp, setSandboxOtp] = useState('');

  // Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

    if (authMode === 'register' && !name.trim()) {
      showToast('Name is required for registration!', 'error');
      return;
    }

    try {
      setLoading(true);
      if (authMode === 'login') {
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setCountdown(60);
        showToast('OTP sent successfully!', 'success');
        
        if (res.data?.isMock) {
          setIsSandbox(true);
          setSandboxOtp(res.data.otp);
          showToast(`[Sandbox Mode] Use OTP: ${res.data.otp}`, 'info');
        } else {
          setIsSandbox(false);
        }
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to send OTP. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showToast('Please enter the 6-digit OTP code', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(phone, otp);
      if (res.success) {
        showToast('Successfully authenticated!', 'success');
        navigate(redirect ? `/${redirect}` : '/');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('OTP verification failed', 'error');
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
            {authMode === 'login' && 'Welcome Back!'}
            {authMode === 'register' && 'Create an Account'}
            {authMode === 'otp' && 'OTP Sign In'}
          </h2>
          <p className="text-xs text-gray-400">
            {authMode === 'login' && 'We are so excited to see you again!'}
            {authMode === 'register' && 'Join Nitro Hub today and get premium services!'}
            {authMode === 'otp' && 'Log in or sign up instantly with your mobile number'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-discord-chat p-1 rounded-xl border border-white/5 gap-1">
          <button
            onClick={() => {
              setAuthMode('login');
              setLoading(false);
            }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-all ${
              authMode === 'login' ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => {
              setAuthMode('register');
              setLoading(false);
            }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-all ${
              authMode === 'register' ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setAuthMode('otp');
              setLoading(false);
            }}
            className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold tracking-wide uppercase transition-all ${
              authMode === 'otp' ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            OTP Login
          </button>
        </div>

        {/* Form rendering */}
        {authMode !== 'otp' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {authMode === 'register' && (
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

            {authMode === 'register' && (
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
              {authMode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>
        ) : (
          /* OTP Auth Form */
          <div className="flex flex-col gap-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm font-semibold"
                      placeholder="e.g. 9876543210"
                    />
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-2.5 leading-normal">
                    We will send a 6-digit OTP to verify your phone. A new account will be created automatically if you do not have one.
                  </span>
                </div>

                <button
                  type="submit"
                  className="mt-2 py-3.5 bg-discord-blurple hover:bg-[#4752c4] text-white font-bold rounded-xl transition-all shadow-lg shadow-discord-blurple/25 active:scale-95 flex items-center justify-center gap-2"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      disabled
                      value={phone}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm font-semibold opacity-60"
                    />
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Verification OTP</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-[0.3em] text-center font-bold"
                      placeholder="XXXXXX"
                    />
                    <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Resend and change phone logic */}
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Change Number
                  </button>

                  {countdown > 0 ? (
                    <span className="text-gray-500">Resend OTP in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-discord-blurple hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {isSandbox && (
                  <div className="bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-[11px] font-bold p-3 rounded-xl text-center">
                    [Sandbox Mode] Enter OTP Code: <span className="font-mono text-white text-sm bg-discord-darkest px-2 py-0.5 rounded ml-1">{sandboxOtp}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 py-3.5 bg-discord-green hover:bg-[#4dd278] text-discord-darkest font-extrabold rounded-xl transition-all shadow-lg shadow-discord-green/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Verify & Log In
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer switch prompt */}
        {authMode !== 'otp' && (
          <div className="text-center mt-2">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-xs text-discord-blurple hover:underline font-semibold"
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Log In'}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default Auth;
