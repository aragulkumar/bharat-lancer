const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Razorpay Integration
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  
  // File Access Control
  filesUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  
  // Transaction Details
  paymentMethod: {
    type: String
  },
  transactionId: {
    type: String
  },
  
  // Metadata
  description: {
    type: String
  },
  notes: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for faster queries
paymentSchema.index({ job: 1 });
paymentSchema.index({ employer: 1 });
paymentSchema.index({ freelancer: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
