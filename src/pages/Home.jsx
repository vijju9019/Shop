import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { Sparkles, MessageSquare, Shield, Send, ArrowRight, HelpCircle, Mail, Phone, MapPin, Star } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        // Select 3 featured products (e.g., Discord Nitro, Nitro Basic, Server Boost 3 Months)
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate contact form submission
    setContactSuccess(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const reviews = [
    {
      name: 'Zeus.eth',
      role: 'Guild Owner',
      quote: 'Instantly got my 12 Months Server Boosts delivered! Super cheap prices and extremely friendly agents. 10/10 service.',
      stars: 5,
      avatar: 'Z',
    },
    {
      name: 'Aria_Dev',
      role: 'Bot Developer',
      quote: 'Was skeptical about the discounted Nitro prices, but it worked perfectly. Active badge is on my profile now. Thanks Nitro Hub!',
      stars: 5,
      avatar: 'A',
    },
    {
      name: 'NexusClan',
      role: 'Clan Leader',
      quote: 'Highly recommended for esports/gaming communities. Paid via UPI and boosts were active on our server within 5 minutes.',
      stars: 5,
      avatar: 'N',
    },
  ];

  const faqs = [
    {
      q: 'How are Discord Nitros and Server Boosts delivered?',
      a: 'After a successful payment, you will be redirected to our WhatsApp line with a pre-filled message containing your unique Order ID. Our delivery staff will then verify the order and process it. You will be required to provide your Discord username. The entire process is handled manually and takes between 5 to 30 minutes.',
    },
    {
      q: 'Is this process safe for my Discord account?',
      a: 'Yes, it is 100% safe! We do not require your Discord password. We only require your Discord username to deliver gifts or apply boosts. Your account is completely secure and will not violate any security protocols.',
    },
    {
      q: 'Which payment methods do you support?',
      a: 'Through our integration with Razorpay, we support all major credit cards, debit cards, net banking, wallets, and UPI payments (including Google Pay, PhonePe, Paytm, and BHIM). Checkout is completely secure.',
    },
    {
      q: 'What is your refund policy?',
      a: 'Due to the digital nature of Nitro codes and server boosts, refunds are not possible once the service has been delivered. However, if there is a technical problem or delay, our WhatsApp support team is available 24/7 to resolve the issue or process a refund if delivery is not possible.',
    },
  ];

  return (
    <div className="flex flex-col gap-24 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 lg:px-8 py-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-discord-blurple/20 rounded-full blur-[100px] glow-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-discord-fuchsia/15 rounded-full blur-[120px] glow-glow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-discord-blurple/10 border border-discord-blurple/25 w-fit mx-auto lg:mx-0 text-discord-blurple text-xs font-bold uppercase tracking-wider animate-bounce">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Upgrade Your Discord Experience
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Get Premium <span className="shimmer-text">Discord Services</span> at Cheap Rates
            </h1>
            
            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0">
              Unlock Nitro perks, custom emojis, HD video streaming, and community Server Boosts instantly. Secure checkouts via Razorpay & UPI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link
                to="/shop"
                className="px-8 py-4 font-bold bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white rounded-xl transition-all shadow-xl shadow-discord-blurple/30 flex items-center justify-center gap-2 group"
              >
                Explore Shop
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#faq"
                className="px-8 py-4 font-semibold bg-white/5 hover:bg-white/10 active:scale-95 text-gray-300 hover:text-white rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden glass border border-white/10 p-6 flex flex-col justify-between shadow-2xl">
              {/* Fake Discord Chat Interface */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-extrabold text-sm shadow">NH</div>
                  <div>
                    <h3 className="font-bold text-white text-sm"># nitro-fulfillment</h3>
                    <p className="text-xs text-discord-green flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-discord-green inline-block animate-pulse"></span> Delivery Agent Online
                    </p>
                  </div>
                </div>
                <div className="bg-discord-blurple/10 text-discord-blurple border border-discord-blurple/20 px-3 py-1 rounded-full text-xs font-bold">
                  Fast Fulfillment
                </div>
              </div>

              <div className="flex-grow flex flex-col gap-4 overflow-y-auto max-h-56 pr-2 text-sm leading-relaxed">
                <div className="bg-discord-darker p-3.5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs mb-1">Customer Support • 5m ago</p>
                  <p className="text-white">Hello! Welcome to Nitro Hub. Payment verified successfully. How can we help?</p>
                </div>
                <div className="bg-discord-blurple/10 p-3.5 rounded-xl border border-discord-blurple/10 self-end max-w-[85%]">
                  <p className="text-discord-blurple text-xs mb-1">You • Just now</p>
                  <p className="text-white">Payment has been done. My Order ID is NH_839F18AC. Please process my Discord purchase.</p>
                </div>
                <div className="bg-discord-darker p-3.5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs mb-1">Customer Support • Just now</p>
                  <p className="text-white">Order received for 2x Server Boosts (12 Months). Injecting boosts into your server now... ⚡</p>
                </div>
              </div>

              <div className="mt-4 border-t border-white/5 pt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Message #nitro-fulfillment"
                  disabled
                  className="flex-grow bg-discord-chat text-xs text-gray-500 rounded-xl px-4 py-3 border border-white/5"
                />
                <button disabled className="p-3 rounded-xl bg-discord-blurple/20 text-discord-blurple">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center flex flex-col gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Featured Services</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Our most popular services, custom-made to upgrade your personal account or server community instantly.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            to="/shop"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold border border-white/5 rounded-xl transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-discord-fuchsia/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center flex flex-col gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center justify-center gap-2.5">
            <MessageSquare className="w-8 h-8 text-discord-blurple" />
            Loved By Gamers
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            See what guild owners, bot builders, and Discord users say about our delivery times and client support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="glass p-6 rounded-2xl border border-white/5 flex flex-col gap-4 relative">
              <div className="flex gap-1">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-discord-yellow text-discord-yellow" />
                ))}
              </div>
              <p className="text-gray-300 italic text-sm leading-relaxed flex-grow">
                "{rev.quote}"
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center font-bold text-white uppercase">
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 w-full">
        <div className="text-center flex flex-col gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center justify-center gap-2.5">
            <HelpCircle className="w-8 h-8 text-discord-yellow" />
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Got questions? We have answers to help you understand our operations.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl border border-white/5 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-white hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-xl text-discord-blurple">
                  {faqOpen[index] ? '−' : '+'}
                </span>
              </button>
              
              {faqOpen[index] && (
                <div className="p-5 pt-0 border-t border-white/5 bg-discord-darker/30 text-sm text-gray-400 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-12 relative overflow-hidden">
          
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-white">Need Assistance?</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any doubts regarding custom boost configurations, wholesale business options, or order processing, drop us a message! Our team is ready to respond.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 flex items-center justify-center text-discord-blurple">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Email Address</p>
                  <p className="text-gray-400 text-xs">support@nitrohub.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-discord-green/10 border border-discord-green/20 flex items-center justify-center text-discord-green">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">WhatsApp Support</p>
                  <p className="text-gray-400 text-xs">+91 92725 01980</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-xl bg-discord-yellow/10 border border-discord-yellow/20 flex items-center justify-center text-discord-yellow">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Secure Payments</p>
                  <p className="text-gray-400 text-xs">PCI-DSS Compliant Gateway Integration</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 bg-discord-darker/40 p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold text-lg text-white mb-2">Send a Message</h3>
            
            {contactSuccess && (
              <div className="p-4 rounded-xl bg-discord-green/20 border border-discord-green/30 text-discord-green text-sm font-semibold">
                Message submitted! We will respond shortly.
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                placeholder="Discord Ninja"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                placeholder="ninja@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
              <textarea
                required
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
                placeholder="How long does Server Boosting delivery take for custom orders?"
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-3.5 bg-discord-blurple hover:bg-[#4752c4] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-discord-blurple/10"
            >
              Submit Message
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </section>

    </div>
  );
};

export default Home;
