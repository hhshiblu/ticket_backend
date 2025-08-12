const PaymentService = require('../services/PaymentService');

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  // Get all payments with pagination and filters
  async getAllPayments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: req.query.status,
        method: req.query.method,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      const result = await this.paymentService.getAllPayments(page, limit, filters);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getAllPayments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get payment by ID
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.paymentService.getPaymentById(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getPaymentById error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create new payment
  async createPayment(req, res) {
    try {
      const paymentData = req.body;
      const result = await this.paymentService.createPayment(paymentData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - createPayment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.paymentService.updatePaymentStatus(id, status);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - updatePaymentStatus error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get vendor earnings
  async getVendorEarnings(req, res) {
    try {
      const { vendorId } = req.params;
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };
      
      const result = await this.paymentService.getVendorEarnings(vendorId, filters);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getVendorEarnings error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get withdrawal requests
  async getWithdrawalRequests(req, res) {
    try {
      const status = req.query.status || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await this.paymentService.getWithdrawalRequests(status, page, limit);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getWithdrawalRequests error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create withdrawal request
  async createWithdrawalRequest(req, res) {
    try {
      const withdrawalData = req.body;
      const result = await this.paymentService.createWithdrawalRequest(withdrawalData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - createWithdrawalRequest error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Process withdrawal
  async processWithdrawal(req, res) {
    try {
      const { withdrawalId } = req.params;
      const { status, processedBy } = req.body;
      const result = await this.paymentService.processWithdrawal(withdrawalId, status, processedBy);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - processWithdrawal error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get payment statistics
  async getPaymentStats(req, res) {
    try {
      const result = await this.paymentService.getPaymentStats();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getPaymentStats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get vendor payment statistics
  async getVendorPaymentStats(req, res) {
    try {
      const { vendorId } = req.params;
      const result = await this.paymentService.getVendorPaymentStats(vendorId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getVendorPaymentStats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get user payments
  async getUserPayments(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await this.paymentService.getUserPayments(userId, page, limit);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('PaymentController - getUserPayments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController;
