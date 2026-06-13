import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['nitro', 'boost'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  imageUrl: {
    type: String,
    required: false,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  duration: {
    type: String,
    required: true,
    default: '1 Month', // '1 Month', '3 Months', '12 Months'
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
