import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { Shield, DollarSign, ShoppingBag, Users, Clock, Edit3, Trash2, PlusCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user, token, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms management
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'nitro',
    description: '',
    price: 0,
    imageUrl: '',
    features: '',
    duration: '1 Month',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      showToast('Access Denied. Admins Only.', 'error');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Stats
      const statsRes = await axios.get(`${API_URL}/orders/admin/stats/dashboard`, { headers });
      setStats(statsRes.data);

      // Fetch Orders
      const ordersRes = await axios.get(`${API_URL}/orders`, { headers });
      setOrders(ordersRes.data);

      // Fetch Products
      const productsRes = await axios.get(`${API_URL}/products`);
      setProducts(productsRes.data);

    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchData();
    }
  }, [isAdmin, token]);

  const handleUpdateOrderStatus = async (id, statusType, value) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = statusType === 'order' ? { orderStatus: value } : { paymentStatus: value };

      const { data } = await axios.put(`${API_URL}/orders/${id}/status`, body, { headers });
      
      // Update local state
      setOrders((prev) => prev.map((ord) => (ord._id === id ? data : ord)));
      showToast('Order status updated successfully!', 'success');
      
      // Refresh stats
      const statsRes = await axios.get(`${API_URL}/orders/admin/stats/dashboard`, { headers });
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...productForm,
        features: productForm.features.split('\n').filter(f => f.trim() !== ''),
      };

      if (editingProductId) {
        // Edit Product
        const { data } = await axios.put(`${API_URL}/products/${editingProductId}`, payload, { headers });
        setProducts((prev) => prev.map((p) => (p._id === editingProductId ? data : p)));
        showToast('Product updated successfully!', 'success');
      } else {
        // Add Product
        const { data } = await axios.post(`${API_URL}/products`, payload, { headers });
        setProducts((prev) => [data, ...prev]);
        showToast('Product created successfully!', 'success');
      }

      handleCloseProductModal();
    } catch (err) {
      console.error(err);
      showToast('Failed to save product', 'error');
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      imageUrl: prod.imageUrl || '',
      features: prod.features.join('\n'),
      duration: prod.duration,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/products/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
    }
  };

  const handleCloseProductModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'nitro',
      description: '',
      price: 0,
      imageUrl: '',
      features: '',
      duration: '1 Month',
    });
    setShowProductModal(false);
  };

  if (!isAdmin) return null;
  if (loading && !stats) return <Loading fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-discord-yellow" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Fulfill pending Discord boosts, customize products catalog, and inspect transaction metrics.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/5 text-xs text-white font-bold rounded-xl transition-all"
        >
          Refresh Dashboard Data
        </button>
      </div>

      {/* Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-discord-green/10 border border-discord-green/20 flex items-center justify-center text-discord-green">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-white">₹{stats.metrics.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 flex items-center justify-center text-discord-blurple">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-white">{stats.metrics.totalOrders}</h3>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-discord-yellow/10 border border-discord-yellow/20 flex items-center justify-center text-discord-yellow">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Awaiting Delivery</p>
              <h3 className="text-2xl font-extrabold text-discord-yellow">{stats.metrics.pendingFulfillment}</h3>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Customers</p>
              <h3 className="text-2xl font-extrabold text-white">{stats.metrics.totalCustomers}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex bg-discord-chat p-1 rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'orders' ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Orders & Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'products' ? 'bg-discord-blurple text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Product Catalog ({products.length})
        </button>
      </div>

      {/* Active Tab View */}
      <div className="w-full">
        {activeTab === 'orders' && (
          <div className="glass rounded-3xl border border-white/5 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-discord-darker/60 border-b border-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Customer & Discord</th>
                  <th className="p-4">Items / Total</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4">Receipt References</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-semibold">
                      No orders logged in database.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                      {/* Customer Info */}
                      <td className="p-4">
                        <p className="font-bold text-white">{ord.customerDetails?.name}</p>
                        <p className="text-xs text-gray-500">{ord.customerDetails?.email}</p>
                        <div className="mt-1">
                          <span className="text-xs bg-discord-yellow/10 text-discord-yellow border border-discord-yellow/20 px-2 py-0.5 rounded font-bold">
                            @{ord.customerDetails?.discordUsername}
                          </span>
                        </div>
                      </td>

                      {/* Items & Subtotal */}
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          {ord.orderItems?.map((item) => (
                            <span key={item._id} className="text-xs text-gray-300 font-semibold">
                              {item.name} <span className="text-gray-500">x{item.qty}</span>
                            </span>
                          ))}
                        </div>
                        <p className="font-extrabold text-white text-base mt-1.5">₹{ord.totalAmount.toFixed(2)}</p>
                      </td>

                      {/* Payment Status Editor */}
                      <td className="p-4">
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, 'payment', e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-discord-blurple bg-discord-darkest ${
                            ord.paymentStatus === 'paid'
                              ? 'text-discord-green border-emerald-500/30'
                              : ord.paymentStatus === 'failed'
                              ? 'text-discord-red border-rose-500/30'
                              : 'text-discord-yellow border-amber-500/30'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>

                      {/* Delivery Status Editor */}
                      <td className="p-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, 'order', e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-discord-blurple bg-discord-darkest ${
                            ord.orderStatus === 'completed'
                              ? 'text-discord-green border-emerald-500/30'
                              : ord.orderStatus === 'processing'
                              ? 'text-discord-blurple border-indigo-500/30'
                              : 'text-gray-400 border-white/10'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Reference IDs */}
                      <td className="p-4 text-xs font-mono text-gray-500">
                        <p className="font-bold text-gray-400">ID: {ord._id.toString().toUpperCase()}</p>
                        <p className="mt-0.5">RZP: {ord.razorpayOrderId}</p>
                        {ord.razorpayPaymentId && <p>PAY: {ord.razorpayPaymentId}</p>}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total catalogued: <strong className="text-white">{products.length}</strong></span>
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setShowProductModal(true);
                }}
                className="px-4 py-2 bg-discord-blurple hover:bg-[#4752c4] active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Product
              </button>
            </div>

            {/* Products grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod._id} className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-lg">{prod.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-discord-blurple tracking-wider">{prod.category}</span>
                    </div>
                    <span className="font-extrabold text-white text-xl">₹{prod.price.toFixed(2)}</span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{prod.description}</p>

                  <div className="mt-auto border-t border-white/5 pt-4 flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditProductClick(prod)}
                      className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="p-2 text-discord-red hover:text-white bg-discord-red/10 hover:bg-discord-red rounded-lg border border-discord-red/20 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-discord-darkest/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleProductSubmit}
            className="max-w-lg w-full bg-discord-darker rounded-3xl border border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-scale-in"
          >
            <h3 className="font-extrabold text-xl text-white">
              {editingProductId ? 'Edit Product Details' : 'Add New Service Product'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  placeholder="Discord Nitro"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <option value="nitro">Nitro</option>
                  <option value="boost">Boost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billing Duration</label>
                <input
                  type="text"
                  required
                  value={productForm.duration}
                  onChange={(e) => setProductForm({ ...productForm, duration: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  placeholder="1 Month"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price (INR)</label>
                <input
                  type="number"
                  required
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  required
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm resize-none"
                  placeholder="Description of the service perks..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Features (One per line)
                </label>
                <textarea
                  rows="3"
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm resize-none"
                  placeholder="Features list..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4 border-t border-white/5 pt-4 justify-end">
              <button
                type="button"
                onClick={handleCloseProductModal}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold border border-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-discord-blurple hover:bg-[#4752c4] text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {editingProductId ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
