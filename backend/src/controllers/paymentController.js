const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Job = require('../models/Job');

// Initialize Razorpay (will use test mode keys from .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
});

/**
 * Create payment order
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { jobId, freelancerId, amount } = req.body;

    if (!jobId || !freelancerId || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide job ID, freelancer ID, and amount'
      });
    }

    // Verify job exists and user is the employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the job employer can make payments'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `job_${jobId}_${Date.now()}`,
      notes: {
        jobId: jobId,
        freelancerId: freelancerId,
        employerId: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      job: jobId,
      employer: req.user.id,
      freelancer: freelancerId,
      amount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      message: 'Payment order created successfully',
      data: {
        payment,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        },
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'test_key_id'
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating payment order'
    });
  }
};

/**
 * Verify payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide order ID, payment ID, and signature'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // Update payment record
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.status = 'completed';
      payment.filesUnlocked = true;
      payment.unlockedAt = new Date();
      await payment.save();

      // Update job status
      await Job.findByIdAndUpdate(payment.job, {
        selectedFreelancer: payment.freelancer,
        status: 'in-progress'
      });

      res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully. Files unlocked!',
        data: { payment }
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed. Invalid signature.'
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error verifying payment'
    });
  }
};

/**
 * Get payment details
 */
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('job', 'title description')
      .populate('employer', 'name email companyName')
      .populate('freelancer', 'name email skills');

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    // Check if user is involved in the payment
    if (
      payment.employer._id.toString() !== req.user.id &&
      payment.freelancer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to view this payment'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching payment'
    });
  }
};

/**
 * Get all payments for a user
 */
exports.getUserPayments = async (req, res) => {
  try {
    const filter = {
      $or: [
        { employer: req.user.id },
        { freelancer: req.user.id }
      ]
    };

    const payments = await Payment.find(filter)
      .populate('job', 'title description')
      .populate('employer', 'name email companyName')
      .populate('freelancer', 'name email skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: { payments }
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching payments'
    });
  }
};

/**
 * Check file access for a job
 */
exports.checkFileAccess = async (req, res) => {
  try {
    const { jobId } = req.params;

    const payment = await Payment.findOne({
      job: jobId,
      freelancer: req.user.id,
      status: 'completed',
      filesUnlocked: true
    });

    if (payment) {
      res.status(200).json({
        status: 'success',
        data: {
          hasAccess: true,
          unlockedAt: payment.unlockedAt
        }
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          hasAccess: false,
          message: 'Payment required to access files'
        }
      });
    }
  } catch (error) {
    console.error('Check file access error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error checking file access'
    });
  }
};
