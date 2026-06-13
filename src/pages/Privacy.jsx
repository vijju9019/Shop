import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">
      
      {/* Back Button */}
      <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Shield className="w-8 h-8 text-discord-green" />
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Last updated: June 13, 2026</p>

        <div className="flex flex-col gap-6 text-sm text-gray-300 leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you interact with Nitro Hub, create an account, or execute purchases, we collect details necessary to process your transaction and complete service delivery:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li><strong>Personal Info:</strong> Full name, Email address.</li>
              <li><strong>Fulfillment details:</strong> Discord username (required for adding code gifts or applying Server Boosts).</li>
              <li><strong>Transaction metadata:</strong> Order items, total amounts, and payment references from Razorpay. We do NOT store credit card details or bank credentials on our servers.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">2. How We Use Your Information</h2>
            <p>
              We process customer details solely for operational and support objectives:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-1">
              <li>Creating your Nitro Hub order and generating payment tokens via Razorpay.</li>
              <li>Emailing order confirmation invoices.</li>
              <li>Identifying your account on Discord to execute manual Nitro deliveries or apply community Server Boosts.</li>
              <li>Providing support on WhatsApp when confirming order references.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">3. Data Security</h2>
            <p>
              We prioritize data safety and employ security actions to protect personal information. All API communications are secured via Secure Socket Layer (SSL) encryption. Payment procedures are processed directly on secure servers compliant with PCI-DSS guidelines managed by Razorpay.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">4. Sharing Your Data</h2>
            <p>
              Nitro Hub does not trade, rent, or distribute user details to third parties. Information is only shared with trusted processors essential to complete transaction services (e.g., MongoDB database servers, Razorpay payment APIs, and NodeMailer SMTP servers).
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">5. Cookies</h2>
            <p>
              We store session configuration tags and tokens in local storage to keep you authenticated on our portal and maintain shopping cart data.
            </p>
          </section>
        </div>
      </div>

    </div>
  );
};

export default Privacy;
