import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 }, // Auto-deletes from MongoDB after 5 minutes (300 seconds)
  },
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
