import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Eye, Sparkles, Zap } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const isNitro = product.category === 'nitro';

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full relative">
      
      {/* Category Tag Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
          isNitro 
            ? 'bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30' 
            : 'bg-discord-fuchsia/20 text-discord-fuchsia border border-discord-fuchsia/30'
        }`}>
          {isNitro ? <Sparkles className="w-3 h-3 fill-current" /> : <Zap className="w-3 h-3 fill-current" />}
          {product.category}
        </span>
      </div>

      {/* Product Card Image/Background */}
      <div className="relative pt-[60%] bg-gradient-to-br from-discord-sidebar to-discord-darkest overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {isNitro ? '✨' : '⚡'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-discord-darker to-transparent opacity-80"></div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-discord-blurple transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Product Features Preview */}
        <div className="mb-5 flex flex-col gap-1.5">
          {product.features?.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
              <span className="text-discord-green">✓</span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

        {/* Pricing and CTAs */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-white">
              ₹{product.price.toFixed(2)}
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Billed per {product.duration}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/product/${product._id}`}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all"
              title="View Details"
            >
              <Eye className="w-4.5 h-4.5" />
            </Link>
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white transition-all shadow-md shadow-discord-blurple/10 hover:shadow-discord-blurple/25"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
