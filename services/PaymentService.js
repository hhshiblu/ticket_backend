const PaymentQueries = require("../mysqlquery/PaymentQueries");

class PaymentService {
  constructor() {
    this.paymentQueries = new PaymentQueries();
  }

  async getAllPayments(page = 1, limit = 10, filters = {}) {
    try {
      const payments = await this.paymentQueries.getAllPayments(
        page,
        limit,
        filters
      );
      return {
        success: true,
        data: payments,
        message: "Payments fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getAllPayments error:", error);
      return {
        success: false,
        message: "Failed to fetch payments",
        error: error.message,
      };
    }
  }

  async getPaymentById(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Payment ID is required",
        };
      }

      const payment = await this.paymentQueries.getPaymentById(id);

      if (!payment) {
        return {
          success: false,
          message: "Payment not found",
        };
      }

      return {
        success: true,
        data: payment,
        message: "Payment fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getPaymentById error:", error);
      return {
        success: false,
        message: "Failed to fetch payment",
        error: error.message,
      };
    }
  }

  async createPayment(paymentData) {
    try {
      // Validate required fields
      const requiredFields = [
        "user_id",
        "event_id",
        "amount",
        "payment_method",
      ];
      for (const field of requiredFields) {
        if (!paymentData[field]) {
          return {
            success: false,
            message: `${field} is required`,
          };
        }
      }

      // Validate amount
      if (paymentData.amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
        };
      }

      const paymentId = await this.paymentQueries.createPayment(paymentData);

      return {
        success: true,
        data: { id: paymentId },
        message: "Payment created successfully",
      };
    } catch (error) {
      console.error("PaymentService - createPayment error:", error);
      return {
        success: false,
        message: "Failed to create payment",
        error: error.message,
      };
    }
  }

  async updatePaymentStatus(id, status) {
    try {
      if (!id || !status) {
        return {
          success: false,
          message: "Payment ID and status are required",
        };
      }

      const validStatuses = ["pending", "completed", "failed"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Invalid status",
        };
      }

      await this.paymentQueries.updatePaymentStatus(id, status);

      return {
        success: true,
        message: "Payment status updated successfully",
      };
    } catch (error) {
      console.error("PaymentService - updatePaymentStatus error:", error);
      return {
        success: false,
        message: "Failed to update payment status",
        error: error.message,
      };
    }
  }

  async getVendorEarnings(vendorId, filters = {}) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const earnings = await this.paymentQueries.getVendorEarnings(
        vendorId,
        filters
      );

      return {
        success: true,
        data: earnings,
        message: "Vendor earnings fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getVendorEarnings error:", error);
      return {
        success: false,
        message: "Failed to fetch vendor earnings",
        error: error.message,
      };
    }
  }

  async getWithdrawalRequests(status = "", page = 1, limit = 10) {
    try {
      const withdrawals = await this.paymentQueries.getWithdrawalRequests(
        status,
        page,
        limit
      );

      return {
        success: true,
        data: withdrawals,
        message: "Withdrawal requests fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getWithdrawalRequests error:", error);
      return {
        success: false,
        message: "Failed to fetch withdrawal requests",
        error: error.message,
      };
    }
  }

  async createWithdrawalRequest(withdrawalData) {
    try {
      // Validate required fields
      const requiredFields = ["vendor_id", "amount", "bank_details"];
      for (const field of requiredFields) {
        if (!withdrawalData[field]) {
          return {
            success: false,
            message: `${field} is required`,
          };
        }
      }

      // Validate amount
      if (withdrawalData.amount <= 0) {
        return {
          success: false,
          message: "Amount must be greater than 0",
        };
      }

      const withdrawalId = await this.paymentQueries.createWithdrawalRequest(
        withdrawalData
      );

      return {
        success: true,
        data: { id: withdrawalId },
        message: "Withdrawal request created successfully",
      };
    } catch (error) {
      console.error("PaymentService - createWithdrawalRequest error:", error);
      return {
        success: false,
        message: "Failed to create withdrawal request",
        error: error.message,
      };
    }
  }

  async processWithdrawal(withdrawalId, status, processedBy) {
    try {
      if (!withdrawalId || !status || !processedBy) {
        return {
          success: false,
          message: "Withdrawal ID, status, and processed by are required",
        };
      }

      const validStatuses = ["approved", "rejected", "pending"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Invalid status",
        };
      }

      await this.paymentQueries.processWithdrawal(
        withdrawalId,
        status,
        processedBy
      );

      return {
        success: true,
        message: "Withdrawal processed successfully",
      };
    } catch (error) {
      console.error("PaymentService - processWithdrawal error:", error);
      return {
        success: false,
        message: "Failed to process withdrawal",
        error: error.message,
      };
    }
  }

  async getPaymentStats() {
    try {
      const stats = await this.paymentQueries.getPaymentStats();

      return {
        success: true,
        data: stats,
        message: "Payment stats fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getPaymentStats error:", error);
      return {
        success: false,
        message: "Failed to fetch payment stats",
        error: error.message,
      };
    }
  }

  async getVendorPaymentStats(vendorId) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const stats = await this.paymentQueries.getVendorPaymentStats(vendorId);

      return {
        success: true,
        data: stats,
        message: "Vendor payment stats fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getVendorPaymentStats error:", error);
      return {
        success: false,
        message: "Failed to fetch vendor payment stats",
        error: error.message,
      };
    }
  }

  async getUserPayments(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const payments = await this.paymentQueries.getUserPayments(
        userId,
        page,
        limit
      );

      return {
        success: true,
        data: payments,
        message: "User payments fetched successfully",
      };
    } catch (error) {
      console.error("PaymentService - getUserPayments error:", error);
      return {
        success: false,
        message: "Failed to fetch user payments",
        error: error.message,
      };
    }
  }
}

module.exports = PaymentService;
