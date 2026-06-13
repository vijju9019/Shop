import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-6">
      
      {/* Back Button */}
      <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 flex flex-col gap-6 relative">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <FileText className="w-8 h-8 text-discord-blurple" />
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Last updated: June 13, 2026</p>

        <div className="flex flex-col gap-6 text-sm text-gray-300 leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing and purchasing from Nitro Hub, you agree to comply with and be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using our website or purchasing our services.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">2. Service Fulfillment & Delivery</h2>
            <p>
              All Discord Nitro and Server Boost orders are processed manually. Upon a successful checkout, the buyer is redirected to our verified WhatsApp line. You are required to provide a valid Discord username for delivery. 
            </p>
            <p>
              Standard fulfillment timelines average between 5 to 30 minutes, subject to queue capacity. Nitro Hub guarantees the delivery of functioning digital services to the handle specified during checkout. We are not responsible for delivery delays resulting from incorrect Discord handles provided by the user.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">3. Refund & Cancellation Policy</h2>
            <p>
              Due to the immediate, non-returnable nature of digital assets (including Discord gifts, links, and boosts), all completed purchases are final. Refunds will not be processed once a gift code has been delivered or boosts applied to a server.
            </p>
            <p>
              In the event that delivery cannot be finalized due to technical errors on our end, a full refund will be processed back to the original payment method through our payment gateway.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">4. Independent Provider Disclaimer</h2>
            <p>
              Nitro Hub operates as an independent provider of Discord upgrades. We are in no way officially affiliated, associated, authorized, endorsed by, or connected with Discord Inc. or any of its subsidiaries. All product names, logos, and brands are property of their respective owners.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-white">5. Governing Law</h2>
            <p>
              These Terms shall be governed by and defined in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, India.
            </p>
          </section>
        </div>
      </div>

    </div>
  );
};

export default Terms;
