import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-discord-darkest border-t border-white/5 pt-16 pb-8 px-4 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Logo and Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-discord-blurple p-2 rounded-xl text-white">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span className="font-sans font-extrabold text-xl tracking-tight text-white">
              NITRO <span className="text-discord-blurple">HUB</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            The premium destination for purchasing Discord Nitro, Server Boosts, and community upgrades. Cheap prices, secure checkout, and instant delivery assistance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">Shop Services</Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-400 hover:text-white transition-colors">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact & Support</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2.5 text-gray-400">
              <Mail className="w-4 h-4 text-discord-blurple" />
              <span>support@nitrohub.com</span>
            </li>
            <li className="flex items-center gap-2.5 text-gray-400">
              <Phone className="w-4 h-4 text-discord-green" />
              <span>+91 92725 01980</span>
            </li>
            <li className="flex items-center gap-2.5 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-discord-yellow" />
              <span>Fulfillment: Discord/WhatsApp</span>
            </li>
          </ul>
        </div>

        {/* Legals */}
        <div>
          <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Policies</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/5 pt-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 Nitro Hub. All rights reserved.</p>
        <p className="text-center md:text-right">
          Disclaimer: Nitro Hub is an independent provider and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Discord Inc. or any of its subsidiaries.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
