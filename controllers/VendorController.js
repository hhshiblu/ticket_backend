const VendorService = require("../services/VendorService");

class VendorController {
  constructor() {
    this.vendorService = new VendorService();
  }

  async getVendorById(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.vendorService.getVendorById(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error in getVendorById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendorStats(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.vendorService.getVendorStats(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in getVendorStats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateVendor(req, res) {
    try {
      const { vendorId } = req.params;
      const vendorData = req.body;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      if (!vendorData.name || !vendorData.email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      const result = await this.vendorService.updateVendor(
        vendorId,
        vendorData
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in updateVendor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getVendorWithEvents(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.vendorService.getVendorWithEvents(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in getVendorWithEvents:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async createVendor(req, res) {
    try {
      const vendorData = req.body;

      if (!vendorData.name || !vendorData.email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      const result = await this.vendorService.createVendor(vendorData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in createVendor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getAllVendors(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const filters = { status, search };

      const result = await this.vendorService.getAllVendors(
        page,
        limit,
        filters
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in getAllVendors:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async approveVendor(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.vendorService.approveVendor(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in approveVendor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async suspendVendor(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.vendorService.suspendVendor(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in suspendVendor:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = VendorController;
