const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../utils/authMiddleware');

// All payment routes require authentication
router.post('/create', protect, paymentController.createPaymentOrder);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/user', protect, paymentController.getUserPayments);
router.get('/:id', protect, paymentController.getPayment);
router.get('/access/:jobId', protect, paymentController.checkFileAccess);

module.exports = router;
