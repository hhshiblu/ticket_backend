const WithdrawalService = require('../services/WithdrawalService');

class WithdrawalController {
  constructor() {
    this.withdrawalService = new WithdrawalService();
  }

  async getVendorWithdrawals(req, res) {
    try {
      const { vendorId } = req.params;
      
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: 'Vendor ID is required'
        });
      }

      const result = await this.withdrawalService.getVendorWithdrawals(vendorId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in getVendorWithdrawals:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getWithdrawalStats(req, res) {
    try {
      const { vendorId } = req.params;
      
      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: 'Vendor ID is required'
        });
      }

      const result = await this.withdrawalService.getWithdrawalStats(vendorId);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in getWithdrawalStats:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async createWithdrawal(req, res) {
    try {
      const withdrawalData = req.body;
      
      if (!withdrawalData.vendor_id || !withdrawalData.amount || !withdrawalData.bank_details) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: vendor_id, amount, bank_details'
        });
      }

      const result = await this.withdrawalService.createWithdrawal(withdrawalData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createWithdrawal:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async updateWithdrawalStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, processedBy } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({
          success: false,
          message: 'Withdrawal ID and status are required'
        });
      }

      const result = await this.withdrawalService.updateWithdrawalStatus(id, status, processedBy);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in updateWithdrawalStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getWithdrawalById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Withdrawal ID is required'
        });
      }

      const result = await this.withdrawalService.getWithdrawalById(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getWithdrawalById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = WithdrawalController;
