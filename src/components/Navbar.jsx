import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Shield, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="glass-nav sticky top-0 z-40 w-full px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-discord-blurple p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="font-sans font-extrabold text-2xl tracking-tight text-white">
            NITRO <span className="text-discord-blurple">HUB</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
            Home
          </Link>
          <Link to="/shop" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-1">
            Shop
          </Link>
          <Link to="/#faq" className="text-gray-300 hover:text-white transition-colors duration-200" onClick={() => {
            const el = document.getElementById('faq');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            FAQ
          </Link>
          <Link to="/#contact" className="text-gray-300 hover:text-white transition-colors duration-200" onClick={() => {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            Contact
          </Link>
        </div>

        {/* Right Action Icons */}
        <div className="hidden md:flex items-center gap-5">
          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-discord-blurple text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-discord-darkest animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Info */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-discord-darker hover:bg-white/5 border border-white/5 transition-all text-sm font-medium text-white"
              >
                <div className="w-6 h-6 rounded-full bg-discord-blurple flex items-center justify-center font-bold text-xs uppercase text-white shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                {isAdmin && <Shield className="w-3.5 h-3.5 text-discord-yellow" />}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass shadow-2xl p-2 border border-white/10 flex flex-col gap-1 z-50 text-sm animate-fade-in">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="font-semibold text-white truncate">{user.email}</p>
                  </div>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-discord-yellow hover:bg-discord-yellow/10 rounded-lg transition-colors font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-discord-red hover:bg-discord-red/10 rounded-lg transition-colors text-left w-full font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2 text-sm font-bold bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white rounded-lg transition-all shadow-lg shadow-discord-blurple/25"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/cart" className="relative p-2 text-gray-300">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-discord-blurple text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-discord-darkest">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl glass border border-white/5 flex flex-col gap-3 animate-slide-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/#faq"
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('faq');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            FAQ
          </Link>
          <Link
            to="/#contact"
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            Contact
          </Link>
          
          <div className="border-t border-white/5 my-2"></div>
          
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-1 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-discord-blurple flex items-center justify-center font-bold text-xs text-white">
                  {user.name.charAt(0)}
                </div>
                <span className="font-semibold text-white">{user.name}</span>
                {isAdmin && <span className="text-[10px] bg-discord-yellow/10 text-discord-yellow border border-discord-yellow/20 px-2 py-0.5 rounded font-bold">ADMIN</span>}
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-discord-yellow hover:bg-discord-yellow/10 rounded-lg transition-colors font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-discord-red hover:bg-discord-red/10 rounded-lg transition-colors text-left w-full font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-bold bg-discord-blurple hover:bg-[#4752c4] text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
