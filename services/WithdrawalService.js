const WithdrawalQueries = require('../mysqlquery/WithdrawalQueries');

class WithdrawalService {
  constructor() {
    this.withdrawalQueries = new WithdrawalQueries();
  }

  async getVendorWithdrawals(vendorId) {
    try {
      const result = await this.withdrawalQueries.getVendorWithdrawals(vendorId);
      return {
        success: true,
        data: result[0],
        message: 'Withdrawals retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting vendor withdrawals:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve withdrawals'
      };
    }
  }

  async getWithdrawalStats(vendorId) {
    try {
      const result = await this.withdrawalQueries.getWithdrawalStats(vendorId);
      return {
        success: true,
        data: result[0][0],
        message: 'Withdrawal stats retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting withdrawal stats:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve withdrawal stats'
      };
    }
  }

  async createWithdrawal(withdrawalData) {
    try {
      // Validate required fields
      if (!withdrawalData.vendor_id || !withdrawalData.amount || !withdrawalData.bank_details) {
        return {
          success: false,
          data: null,
          message: 'Missing required fields: vendor_id, amount, bank_details'
        };
      }

      // Validate amount
      if (withdrawalData.amount <= 0) {
        return {
          success: false,
          data: null,
          message: 'Amount must be greater than 0'
        };
      }

      const result = await this.withdrawalQueries.createWithdrawal(withdrawalData);
      return {
        success: true,
        data: result[0],
        message: 'Withdrawal request created successfully'
      };
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to create withdrawal request'
      };
    }
  }

  async updateWithdrawalStatus(id, status, processedBy = null) {
    try {
      // Validate status
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          data: null,
          message: 'Invalid status. Must be one of: pending, approved, rejected'
        };
      }

      const result = await this.withdrawalQueries.updateWithdrawalStatus(id, status, processedBy);
      return {
        success: true,
        data: result[0],
        message: 'Withdrawal status updated successfully'
      };
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update withdrawal status'
      };
    }
  }

  async getWithdrawalById(id) {
    try {
      const result = await this.withdrawalQueries.getWithdrawalById(id);
      if (result[0].length === 0) {
        return {
          success: false,
          data: null,
          message: 'Withdrawal not found'
        };
      }
      return {
        success: true,
        data: result[0][0],
        message: 'Withdrawal retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting withdrawal by id:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve withdrawal'
      };
    }
  }
}

module.exports = WithdrawalService;
