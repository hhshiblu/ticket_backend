const AdminService = require("../services/AdminService");

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  // Get admin dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const result = await this.adminService.getDashboardStats();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const result = await this.adminService.getAllUsers();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all vendors
  async getAllVendors(req, res) {
    try {
      const result = await this.adminService.getAllVendors();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all events
  async getAllEvents(req, res) {
    try {
      const result = await this.adminService.getAllEvents();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all tickets
  async getAllTickets(req, res) {
    try {
      const result = await this.adminService.getAllTickets();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get admin analytics
  async getAdminAnalytics(req, res) {
    try {
      const result = await this.adminService.getAdminAnalytics();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all payments and withdrawals
  async getAllPayments(req, res) {
    try {
      const result = await this.adminService.getAllPayments();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all withdrawals
  async getAllWithdrawals(req, res) {
    try {
      const result = await this.adminService.getAllWithdrawals();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update user status
  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await this.adminService.updateUserStatus(userId, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update vendor status
  async updateVendorStatus(req, res) {
    try {
      const { vendorId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await this.adminService.updateVendorStatus(
        vendorId,
        status
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update event status
  async updateEventStatus(req, res) {
    try {
      const { eventId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await this.adminService.updateEventStatus(eventId, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Approve/Reject withdrawal
  async updateWithdrawalStatus(req, res) {
    try {
      const { withdrawalId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await this.adminService.updateWithdrawalStatus(
        withdrawalId,
        status
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get system settings
  async getSystemSettings(req, res) {
    try {
      const result = await this.adminService.getSystemSettings();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update system settings
  async updateSystemSettings(req, res) {
    try {
      const settings = req.body;

      if (!settings) {
        return res.status(400).json({
          success: false,
          message: "Settings data is required",
        });
      }

      const result = await this.adminService.updateSystemSettings(settings);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get system statistics
  async getSystemStatistics(req, res) {
    try {
      const result = await this.adminService.getSystemStatistics();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = AdminController;
