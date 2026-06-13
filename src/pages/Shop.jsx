import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { Search, Filter, RefreshCw, Sparkles, Zap, DollarSign } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('featured');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products from backend api
      let url = `${API_URL}/products`;
      const params = {};
      if (category && category !== 'all') {
        params.category = category;
      }
      if (search) {
        params.search = search;
      }
      const { data } = await axios.get(url, { params });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]); // Fetch on category change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setMaxPrice(2000);
    setSortBy('featured');
    // Fetching will automatically trigger as category reverts to all
  };

  // Client-side price filtering and sorting
  const filteredAndSortedProducts = products
    .filter((prod) => prod.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // 'featured' keeps database insertion order
    });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Nitro Hub Shop</h1>
        <p className="text-gray-400 text-sm md:text-base">
          Browse our catalogue of high-quality premium Discord services. Set your filters and checkout securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters */}
        <div className="glass p-6 rounded-2xl border border-white/5 lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-discord-blurple" />
              Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-discord-blurple hover:underline flex items-center gap-1 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Categories Tab */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: 'All Services', icon: '⚡' },
                { id: 'nitro', label: 'Discord Nitro', icon: '✨' },
                { id: 'boost', label: 'Server Boosts', icon: '🚀' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm rounded-xl border font-semibold transition-all text-left ${
                    category === cat.id
                      ? 'bg-discord-blurple/25 border-discord-blurple/45 text-white'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              <span>Max Price</span>
              <span className="text-white font-extrabold">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-discord-chat rounded-lg appearance-none cursor-pointer accent-discord-blurple"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
              <span>₹100</span>
              <span>₹2000</span>
            </div>
          </div>

          {/* Sort selection */}
          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="flex justify-between items-center text-sm text-gray-400 border-b border-white/5 pb-4">
            <span>
              Showing <span className="text-white font-bold">{filteredAndSortedProducts.length}</span> results
            </span>
            <button
              onClick={fetchProducts}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 rounded-lg transition-colors"
              title="Refresh Products"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <Loading />
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="glass p-12 rounded-3xl border border-white/5 text-center flex flex-col gap-4 items-center">
              <span className="text-5xl">🔍</span>
              <h3 className="text-xl font-bold text-white">No products found</h3>
              <p className="text-gray-400 max-w-sm text-sm">
                Try widening your search terms or relaxing your price range settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2 bg-discord-blurple hover:bg-[#4752c4] text-white font-bold rounded-lg text-sm transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Shop;
