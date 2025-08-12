const VendorQueries = require('../mysqlquery/VendorQueries');

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
          message: 'Vendor not found'
        };
      }
      return {
        success: true,
        data: result[0][0],
        message: 'Vendor retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting vendor by id:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve vendor'
      };
    }
  }

  async getVendorStats(vendorId) {
    try {
      const result = await this.vendorQueries.getVendorStats(vendorId);
      return {
        success: true,
        data: result[0][0],
        message: 'Vendor stats retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting vendor stats:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve vendor stats'
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
          message: 'Name and email are required'
        };
      }

      const result = await this.vendorQueries.updateVendor(vendorId, vendorData);
      return {
        success: true,
        data: result[0],
        message: 'Vendor updated successfully'
      };
    } catch (error) {
      console.error('Error updating vendor:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update vendor'
      };
    }
  }

  async getVendorWithEvents(vendorId) {
    try {
      const result = await this.vendorQueries.getVendorWithEvents(vendorId);
      return {
        success: true,
        data: result[0],
        message: 'Vendor with events retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting vendor with events:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve vendor with events'
      };
    }
  }
}

module.exports = VendorService;
