const AdminQueries = require("../mysqlquery/AdminQueries");

class AdminService {
  constructor() {
    this.adminQueries = new AdminQueries();
  }

  // Get admin dashboard statistics
  async getDashboardStats() {
    try {
      const stats = await this.adminQueries.getDashboardStats();
      return {
        success: true,
        data: stats,
        message: "Dashboard statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      const result = await this.adminQueries.getAllUsers();
      return {
        success: true,
        data: result,
        message: "Users retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all vendors
  async getAllVendors() {
    try {
      const result = await this.adminQueries.getAllVendors();
      return {
        success: true,
        data: result,
        message: "Vendors retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all events
  async getAllEvents() {
    try {
      const result = await this.adminQueries.getAllEvents();
      return {
        success: true,
        data: result,
        message: "Events retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update event status
  async updateEventStatus(eventId, status) {
    try {
      const validStatuses = ["pending", "active", "cancelled", "completed"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: pending, active, cancelled, completed",
        };
      }

      const updated = await this.adminQueries.updateEventStatus(eventId, status);

      if (updated) {
        return {
          success: true,
          message: `Event ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: "Event not found or no changes made",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all tickets
  async getAllTickets() {
    try {
      const result = await this.adminQueries.getAllTickets();
      return {
        success: true,
        data: result,
        message: "Tickets retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get admin analytics
  async getAdminAnalytics() {
    try {
      const analytics = await this.adminQueries.getAdminAnalytics();
      return {
        success: true,
        data: analytics,
        message: "Analytics data retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get all payments and withdrawals
  async getAllPayments() {
    try {
      const result = await this.adminQueries.getAllPayments();
      return {
        success: true,
        data: result,
        message: "Payments retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update user status
  async updateUserStatus(userId, status) {
    try {
      const validStatuses = ["active", "inactive", "suspended"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: active, inactive, suspended",
        };
      }

      const updated = await this.adminQueries.updateUserStatus(userId, status);
      if (updated) {
        return {
          success: true,
          message: `User status updated to ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: "User not found or no changes made",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update vendor status
  async updateVendorStatus(vendorId, status) {
    try {
      const validStatuses = ["active", "inactive", "suspended", "pending"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: active, inactive, suspended, pending",
        };
      }

      const updated = await this.adminQueries.updateVendorStatus(
        vendorId,
        status
      );
      if (updated) {
        return {
          success: true,
          message: `Vendor status updated to ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: "Vendor not found or no changes made",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update event status
  async updateEventStatus(eventId, status) {
    try {
      const validStatuses = [
        "active",
        "inactive",
        "pending",
        "cancelled",
        "completed",
      ];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: active, inactive, pending, cancelled, completed",
        };
      }

      const updated = await this.adminQueries.updateEventStatus(
        eventId,
        status
      );
      if (updated) {
        return {
          success: true,
          message: `Event status updated to ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: "Event not found or no changes made",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Approve/Reject withdrawal
  async updateWithdrawalStatus(withdrawalId, status) {
    try {
      const validStatuses = ["approved", "rejected", "completed"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: approved, rejected, completed",
        };
      }

      const processedAt = status === "completed" ? new Date() : null;
      const updated = await this.adminQueries.updateWithdrawalStatus(
        withdrawalId,
        status,
        processedAt
      );

      if (updated) {
        return {
          success: true,
          message: `Withdrawal ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: "Withdrawal not found or no changes made",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get system settings
  async getSystemSettings() {
    try {
      const settings = await this.adminQueries.getSystemSettings();
      return {
        success: true,
        data: settings,
        message: "System settings retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Update system settings
  async updateSystemSettings(settings) {
    try {
      const updated = await this.adminQueries.updateSystemSettings(settings);
      if (updated) {
        return {
          success: true,
          message: "System settings updated successfully",
        };
      } else {
        return {
          success: false,
          message: "Failed to update system settings",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get system statistics
  async getSystemStatistics() {
    try {
      const statistics = await this.adminQueries.getSystemStatistics();
      return {
        success: true,
        data: statistics,
        message: "System statistics retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

module.exports = AdminService;
