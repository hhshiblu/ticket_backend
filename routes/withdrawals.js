const express = require('express');
const WithdrawalController = require('../controllers/WithdrawalController');

const router = express.Router();
const withdrawalController = new WithdrawalController();

// Get all withdrawals for a vendor
router.get('/vendor/:vendorId', (req, res) => {
  withdrawalController.getVendorWithdrawals(req, res);
});

// Get withdrawal stats for a vendor
router.get('/vendor/:vendorId/stats', (req, res) => {
  withdrawalController.getWithdrawalStats(req, res);
});

// Create a new withdrawal request
router.post('/', (req, res) => {
  withdrawalController.createWithdrawal(req, res);
});

// Update withdrawal status
router.put('/:id/status', (req, res) => {
  withdrawalController.updateWithdrawalStatus(req, res);
});

// Get withdrawal by ID
router.get('/:id', (req, res) => {
  withdrawalController.getWithdrawalById(req, res);
});

module.exports = router;
