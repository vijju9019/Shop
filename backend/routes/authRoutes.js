import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nitrohubjwtsecret123!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, discordUsername } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine if this is the first user; if so, make them an admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      discordUsername: discordUsername || '',
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        discordUsername: user.discordUsername,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        discordUsername: user.discordUsername,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        discordUsername: user.discordUsername,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.discordUsername = req.body.discordUsername !== undefined ? req.body.discordUsername : user.discordUsername;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        discordUsername: updatedUser.discordUsername,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Send OTP to phone
// @route   POST /api/auth/otp/send
// @access  Public
router.post('/otp/send', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Format phone to clean string
  const cleanPhone = phone.trim().replace(/\s+/g, '');

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this phone
    await OTP.deleteMany({ phone: cleanPhone });

    // Save the new OTP
    await OTP.create({ phone: cleanPhone, otp });

    // SMS Dispatch logic
    const provider = process.env.SMS_PROVIDER || 'none';
    let smsSent = false;
    let errorMsg = '';

    if (provider === 'fast2sms' && process.env.FAST2SMS_API_KEY) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            variables_values: otp,
            route: 'otp',
            numbers: cleanPhone
          })
        });
        const data = await response.json();
        if (data.return) {
          smsSent = true;
        } else {
          errorMsg = data.message || 'Fast2SMS returned failure';
        }
      } catch (err) {
        console.error('Fast2SMS error:', err);
        errorMsg = err.message;
      }
    } else if (provider === 'twilio' && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        // Load twilio dynamically to avoid requiring package install if not used
        const twilio = (await import('twilio')).default;
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Nitro Hub verification OTP is ${otp}. Valid for 5 minutes.`,
          to: cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`, // assume India country code if missing
          from: process.env.TWILIO_PHONE_NUMBER
        });
        smsSent = true;
      } catch (err) {
        console.error('Twilio error:', err);
        errorMsg = err.message;
      }
    }

    if (smsSent) {
      console.log(`--- [SMS] Sent OTP ${otp} successfully to ${cleanPhone} via ${provider} ---`);
      res.json({ message: 'OTP sent successfully', isMock: false });
    } else {
      // Development mode / sandbox mode fallback
      console.log('----------------------------------------------------');
      console.log(`--- [DEVELOPMENT MODE] OTP Code for ${cleanPhone}: ${otp} ---`);
      console.log('----------------------------------------------------');
      res.json({
        message: 'OTP sent successfully (sandbox dev mode)',
        isMock: true,
        otp: otp, // Return OTP in response so frontend can show/prefill it for dev testing!
        providerError: errorMsg
      });
    }

  } catch (error) {
    console.error('OTP Send error:', error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// @desc    Verify OTP and log in / sign up
// @route   POST /api/auth/otp/verify
// @access  Public
router.post('/otp/verify', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP code are required' });
  }

  const cleanPhone = phone.trim().replace(/\s+/g, '');

  try {
    // Find matching OTP in DB
    const otpRecord = await OTP.findOne({ phone: cleanPhone, otp: otp.trim() });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Delete verified OTP
    await OTP.deleteMany({ phone: cleanPhone });

    // Check if user already exists
    let user = await User.findOne({ phone: cleanPhone });

    if (!user) {
      // Sign up a new user automatically with a default name
      const lastFour = cleanPhone.substring(cleanPhone.length - 4);
      const defaultName = `User ${lastFour}`;
      
      user = await User.create({
        name: defaultName,
        phone: cleanPhone,
        // No password needed since they use OTP authentication
      });
      console.log(`Created new user account for mobile: ${cleanPhone}`);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email || '',
      phone: user.phone,
      role: user.role,
      discordUsername: user.discordUsername || '',
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error('OTP Verify error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

export default router;
