const express = require('express');
const PaymentController = require('../controllers/PaymentController');

const router = express.Router();
const paymentController = new PaymentController();

// Get all payments with pagination and filters
router.get('/', paymentController.getAllPayments.bind(paymentController));

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats.bind(paymentController));

// Get withdrawal requests
router.get('/withdrawals', paymentController.getWithdrawalRequests.bind(paymentController));

// Get vendor earnings
router.get('/earnings/:vendorId', paymentController.getVendorEarnings.bind(paymentController));

// Get vendor payment statistics
router.get('/vendor/:vendorId/stats', paymentController.getVendorPaymentStats.bind(paymentController));

// Get user payments
router.get('/user/:userId', paymentController.getUserPayments.bind(paymentController));

// Get payment by ID
router.get('/:id', paymentController.getPaymentById.bind(paymentController));

// Create new payment
router.post('/', paymentController.createPayment.bind(paymentController));

// Create withdrawal request
router.post('/withdrawals', paymentController.createWithdrawalRequest.bind(paymentController));

// Update payment status
router.patch('/:id/status', paymentController.updatePaymentStatus.bind(paymentController));

// Process withdrawal
router.patch('/withdrawals/:withdrawalId', paymentController.processWithdrawal.bind(paymentController));

module.exports = router;
