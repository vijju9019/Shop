import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import Product from './models/Product.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Nitro Hub API is running...');
});

// Seed Initial Data
const seedData = async () => {
  try {
    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial products...');
      const products = [
        {
          name: 'Discord Nitro Basic',
          category: 'nitro',
          description: 'Get core Nitro features for a lower cost. Express yourself with custom emojis anywhere, bigger file sharing, and more!',
          price: 149.00,
          duration: '1 Month',
          imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder visual
          features: [
            'Use custom emojis and stickers anywhere',
            'Custom profile theme and status indicators',
            'Bigger file uploads (up to 50MB)',
            'Nitro badge on your profile card'
          ],
          active: true
        },
        {
          name: 'Discord Nitro',
          category: 'nitro',
          description: 'Unlock all the perks! Get custom emojis, HD video streaming, 2 Server Boosts, larger upload sizes, and deep profile customization options.',
          price: 349.00,
          duration: '1 Month',
          imageUrl: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder visual
          features: [
            'All Nitro Basic perks included',
            '2 Free Server Boosts + 30% off extra boosts',
            'HD video streaming (up to 4K & 60FPS)',
            'Huge file uploads (up to 500MB)',
            'Animated avatar, banner, and profile theme colors',
            'Custom sounds and soundboard packs'
          ],
          active: true
        },
        {
          name: 'Server Boost (1 Month)',
          category: 'boost',
          description: 'Supercharge your community server for 1 month! Elevate community perks like audio quality, invite configurations, and emoji counts.',
          price: 199.00,
          duration: '1 Month',
          imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder visual
          features: [
            'Deliver to any server of your choosing',
            'Boost active for a full 30 days',
            'Unlocks extra emojis, audio quality levels, and banners',
            'Instant activation and 24/7 delivery support'
          ],
          active: true
        },
        {
          name: 'Server Boost (3 Months)',
          category: 'boost',
          description: 'Secure server perks for 3 months at a discount. Maintain Level 1/2 statuses for your community with zero interruption.',
          price: 499.00,
          duration: '3 Months',
          imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder visual
          features: [
            'Continuous server boosting for 90 days',
            'Save over 15% compared to monthly rates',
            'Worry-free maintenance of badge and levels',
            'Premium queue priority for quick processing'
          ],
          active: true
        },
        {
          name: 'Server Boost (12 Months)',
          category: 'boost',
          description: 'The ultimate commitment. Protect and upgrade your server for an entire year. Highest priority processing and maximum savings.',
          price: 1799.00,
          duration: '12 Months',
          imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder visual
          features: [
            'Full year (365 days) boost protection',
            'Save 25% off monthly pricing',
            'VIP client support group access',
            'Unique customer rank in Nitro Hub server'
          ],
          active: true
        }
      ];
      await Product.insertMany(products);
      console.log('Seeded products successfully!');
    }

    // 2. Seed Admin User if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('Seeding default Admin user...');
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@nitrohub.com',
        password: 'AdminPassword123!', // Will be hashed automatically by userSchema pre-save hook
        role: 'admin',
        discordUsername: 'NitroHubAdmin',
      });
      await adminUser.save();
      console.log('Admin user seeded: admin@nitrohub.com / AdminPassword123!');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedData();
});
