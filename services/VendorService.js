const VendorQueries = require("../mysqlquery/VendorQueries");

class VendorService {
  constructor() {
    this.vendorQueries = new VendorQueries();
  }

  async getVendorById(vendorId) {
    try {
      const result = await this.vendorQueries.getVendorById(vendorId);
      if (result[0].length === 0) {
        return {
          success: false,
          data: null,
          message: "Vendor not found",
        };
      }
      return {
        success: true,
        data: result[0][0],
        message: "Vendor retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting vendor by id:", error);
      return {
        success: false,
        data: null,
        message: "Failed to retrieve vendor",
      };
    }
  }

  async getVendorStats(vendorId) {
    try {
      const result = await this.vendorQueries.getVendorStats(vendorId);
      return {
        success: true,
        data: result[0][0],
        message: "Vendor stats retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting vendor stats:", error);
      return {
        success: false,
        data: null,
        message: "Failed to retrieve vendor stats",
      };
    }
  }

  async updateVendor(vendorId, vendorData) {
    try {
      // Validate required fields
      if (!vendorData.name || !vendorData.email) {
        return {
          success: false,
          data: null,
          message: "Name and email are required",
        };
      }

      const result = await this.vendorQueries.updateVendor(
        vendorId,
        vendorData
      );
      return {
        success: true,
        data: result[0],
        message: "Vendor updated successfully",
      };
    } catch (error) {
      console.error("Error updating vendor:", error);
      return {
        success: false,
        data: null,
        message: "Failed to update vendor",
      };
    }
  }

  async getVendorWithEvents(vendorId) {
    try {
      const result = await this.vendorQueries.getVendorWithEvents(vendorId);
      return {
        success: true,
        data: result[0],
        message: "Vendor with events retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting vendor with events:", error);
      return {
        success: false,
        data: null,
        message: "Failed to retrieve vendor with events",
      };
    }
  }

  async createVendor(vendorData) {
    try {
      // Validate required fields
      if (!vendorData.name || !vendorData.email) {
        return {
          success: false,
          data: null,
          message: "Name and email are required",
        };
      }

      // Check if email already exists
      const existingVendor = await this.vendorQueries.getVendorByEmail(
        vendorData.email
      );
      if (existingVendor && existingVendor.length > 0) {
        return {
          success: false,
          data: null,
          message: "Vendor with this email already exists",
        };
      }

      const vendorId = await this.vendorQueries.createVendor(vendorData);
      const createdVendor = await this.vendorQueries.getVendorById(vendorId);

      return {
        success: true,
        data: createdVendor[0][0],
        message: "Vendor created successfully",
      };
    } catch (error) {
      console.error("Error creating vendor:", error);
      return {
        success: false,
        data: null,
        message: "Failed to create vendor",
      };
    }
  }

  async getAllVendors(page = 1, limit = 10, filters = {}) {
    try {
      const result = await this.vendorQueries.getAllVendors(
        page,
        limit,
        filters
      );
      return {
        success: true,
        data: result[0],
        message: "Vendors retrieved successfully",
      };
    } catch (error) {
      console.error("Error getting all vendors:", error);
      return {
        success: false,
        data: null,
        message: "Failed to retrieve vendors",
      };
    }
  }

  async approveVendor(vendorId) {
    try {
      const result = await this.vendorQueries.approveVendor(vendorId);
      return {
        success: true,
        data: result[0],
        message: "Vendor approved successfully",
      };
    } catch (error) {
      console.error("Error approving vendor:", error);
      return {
        success: false,
        data: null,
        message: "Failed to approve vendor",
      };
    }
  }

  async suspendVendor(vendorId) {
    try {
      const result = await this.vendorQueries.suspendVendor(vendorId);
      return {
        success: true,
        data: result[0],
        message: "Vendor suspended successfully",
      };
    } catch (error) {
      console.error("Error suspending vendor:", error);
      return {
        success: false,
        data: null,
        message: "Failed to suspend vendor",
      };
    }
  }
}

module.exports = VendorService;
