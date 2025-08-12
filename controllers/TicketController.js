const TicketQueries = require("../mysqlquery/TicketQueries");

class TicketController {
  constructor() {
    this.ticketQueries = new TicketQueries();
  }

  // Get tickets for an event
  async getEventTickets(req, res) {
    try {
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is required",
        });
      }

      const tickets = await this.ticketQueries.getEventTickets(eventId);

      // Parse features JSON
      tickets.forEach((ticket) => {
        if (ticket.features) {
          try {
            ticket.features = JSON.parse(ticket.features);
          } catch (e) {
            ticket.features = [];
          }
        }
      });

      res.status(200).json({
        success: true,
        data: tickets,
        message: "Event tickets fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getEventTickets error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Create a new ticket
  async createTicket(req, res) {
    try {
      const ticketData = req.body;
      const { eventId } = req.params;

      if (!eventId) {
        return res.status(400).json({
          success: false,
          message: "Event ID is required",
        });
      }

      // Validate required fields
      const requiredFields = ["type", "price", "quantity"];
      for (const field of requiredFields) {
        if (!ticketData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`,
          });
        }
      }

      ticketData.event_id = eventId;
      const ticketId = await this.ticketQueries.createTicket(ticketData);

      res.status(201).json({
        success: true,
        data: { id: ticketId },
        message: "Ticket created successfully",
      });
    } catch (error) {
      console.error("TicketController - createTicket error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update a ticket
  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const ticketData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Ticket ID is required",
        });
      }

      await this.ticketQueries.updateTicket(id, ticketData);

      res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
      });
    } catch (error) {
      console.error("TicketController - updateTicket error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Delete a ticket
  async deleteTicket(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Ticket ID is required",
        });
      }

      await this.ticketQueries.deleteTicket(id);

      res.status(200).json({
        success: true,
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      console.error("TicketController - deleteTicket error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get ticket by ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Ticket ID is required",
        });
      }

      const ticket = await this.ticketQueries.getTicketById(id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // Parse features JSON
      if (ticket.features) {
        try {
          ticket.features = JSON.parse(ticket.features);
        } catch (e) {
          ticket.features = [];
        }
      }

      res.status(200).json({
        success: true,
        data: ticket,
        message: "Ticket fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getTicketById error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // New methods for vendor sold tickets
  async getVendorSoldTickets(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const tickets = await this.ticketQueries.getVendorSoldTickets(vendorId);

      res.status(200).json({
        success: true,
        data: tickets,
        message: "Vendor sold tickets fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getVendorSoldTickets error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getVendorTicketStats(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const stats = await this.ticketQueries.getVendorTicketStats(vendorId);

      res.status(200).json({
        success: true,
        data: stats[0] || {},
        message: "Vendor ticket stats fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getVendorTicketStats error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getVendorTicketStatsByStatus(req, res) {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const stats = await this.ticketQueries.getVendorTicketStatsByStatus(vendorId);

      res.status(200).json({
        success: true,
        data: stats[0] || {},
        message: "Vendor ticket stats by status fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getVendorTicketStatsByStatus error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = TicketController;
