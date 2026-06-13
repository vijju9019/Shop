import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        showToast('Failed to load product details', 'error');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleQtyChange = (val) => {
    const newQty = Math.max(1, Math.min(qty + val, 10)); // limit to 10
    setQty(newQty);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast(`${qty}x ${product.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <Loading fullPage />;
  if (!product) return null;

  const isNitro = product.category === 'nitro';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-6">
      
      {/* Back Button */}
      <Link to="/shop" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-4">
        
        {/* Product Visual */}
        <div className="lg:col-span-6 glass rounded-3xl overflow-hidden border border-white/10 p-4 relative">
          <div className="absolute top-8 left-8 z-10">
            <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              isNitro 
                ? 'bg-discord-blurple/25 text-discord-blurple border border-discord-blurple/30' 
                : 'bg-discord-fuchsia/25 text-discord-fuchsia border border-discord-fuchsia/30'
            }`}>
              {isNitro ? <Sparkles className="w-3.5 h-3.5 fill-current" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
              {product.category}
            </span>
          </div>

          <div className="relative pt-[70%] bg-gradient-to-br from-discord-sidebar to-discord-darkest rounded-2xl overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl">
                {isNitro ? '✨' : '⚡'}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-discord-darker to-transparent opacity-90"></div>
          </div>
        </div>

        {/* Product Content Details */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-extrabold">
              Service Category: <span className="text-discord-blurple">{product.category}</span>
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">₹{product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 font-semibold uppercase tracking-wider">/ Billed per {product.duration}</span>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Features Included:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features?.map((feat, index) => (
                <div key={index} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="text-discord-green mt-0.5"><Check className="w-4 h-4 stroke-[3px]" /></span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity</span>
              <div className="flex items-center gap-1 bg-discord-chat p-1 rounded-xl border border-white/5 w-fit">
                <button
                  onClick={() => handleQtyChange(-1)}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white flex items-center justify-center font-bold text-xl transition-all"
                >
                  −
                </button>
                <span className="w-12 text-center font-extrabold text-white">{qty}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white flex items-center justify-center font-bold text-xl transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Pricing Preview */}
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Subtotal</span>
              <span className="text-3xl font-extrabold text-discord-blurple">₹{(product.price * qty).toFixed(2)}</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <button
              onClick={handleAddToCart}
              className="py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white font-bold rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="py-4 bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white font-bold rounded-xl transition-all shadow-xl shadow-discord-blurple/25 flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>

          {/* Safe Check banner */}
          <div className="flex items-center gap-3 bg-discord-darker/40 p-4 rounded-2xl border border-white/5 text-xs text-gray-400 mt-2">
            <ShieldCheck className="w-8 h-8 text-discord-green flex-shrink-0" />
            <p>
              <strong>Guaranteed Safe Delivery:</strong> No Discord password required. Delivery instructions will be processed securely on WhatsApp using your unique Order ID.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
