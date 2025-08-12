const EventService = require("../services/EventService");

class EventController {
  constructor() {
    this.eventService = new EventService();
  }

  // Get all events with filters
  async getAllEvents(req, res) {
    try {
      const filters = {
        category: req.query.category,
        location: req.query.location,
        date: req.query.date,
        status: req.query.status,
        vendor_id: req.query.vendor_id,
      };

      console.log("EventController - getAllEvents filters:", filters); // Debug log

      const result = await this.eventService.getAllEvents(filters);

      console.log("EventController - getAllEvents result:", result); // Debug log

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - getAllEvents error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get event by ID
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.eventService.getEventById(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("EventController - getEventById error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create new event
  async createEvent(req, res) {
    try {
      let eventData = req.body;
      const vendorId = req.query.vendor_id || req.body.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      // Handle file upload if present
      if (req.file) {
        eventData.image_url = `/uploads/${req.file.filename}`;
      }

      // Parse tickets if they come as string
      if (typeof eventData.tickets === "string") {
        try {
          eventData.tickets = JSON.parse(eventData.tickets);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Invalid tickets format",
          });
        }
      }

      const result = await this.eventService.createEvent(eventData, vendorId);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - createEvent error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const vendorId = req.query.vendor_id || req.body.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.eventService.updateEvent(
        id,
        eventData,
        vendorId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - updateEvent error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const vendorId = req.query.vendor_id;
      const isAdmin = req.query.is_admin === "true";

      if (!vendorId && !isAdmin) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID or admin privileges required",
        });
      }

      const result = await this.eventService.deleteEvent(id, vendorId, isAdmin);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - deleteEvent error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get vendor events
  async getVendorEvents(req, res) {
    try {
      const vendorId = req.query.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.eventService.getVendorEvents(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - getVendorEvents error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update event status (admin only)
  async updateEventStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const isAdmin = req.query.is_admin === "true";

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admin privileges required",
        });
      }

      const result = await this.eventService.updateEventStatus(id, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - updateEventStatus error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Search events
  async searchEvents(req, res) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await this.eventService.searchEvents(q);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - searchEvents error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get event stats
  async getEventStats(req, res) {
    try {
      const vendorId = req.query.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.eventService.getEventStats(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - getEventStats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get event earnings
  async getEventEarnings(req, res) {
    try {
      const vendorId = req.query.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.eventService.getEventEarnings(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - getEventEarnings error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get ticket sales analysis
  async getTicketSalesAnalysis(req, res) {
    try {
      const vendorId = req.query.vendor_id;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const result = await this.eventService.getTicketSalesAnalysis(vendorId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("EventController - getTicketSalesAnalysis error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = EventController;
