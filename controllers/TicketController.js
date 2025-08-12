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

  // Get user tickets
  async getUserTickets(req, res) {
    try {
      const { userId } = req.params;
      const tickets = await this.ticketQueries.getUserTickets(userId);

      res.status(200).json({
        success: true,
        data: tickets,
        message: "User tickets fetched successfully",
      });
    } catch (error) {
      console.error("TicketController - getUserTickets error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Download ticket as PDF/Image
  async downloadTicket(req, res) {
    try {
      const { id } = req.params;
      const { format = 'pdf' } = req.query;
      
      const ticket = await this.ticketQueries.getTicketById(id);
      
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // Generate ticket content
      const ticketContent = await this.generateTicketContent(ticket, format);
      
      if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${id}.pdf`);
      } else {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${id}.png`);
      }
      
      res.send(ticketContent);
    } catch (error) {
      console.error("TicketController - downloadTicket error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Generate ticket content (placeholder - you can implement actual PDF/Image generation)
  async generateTicketContent(ticket, format) {
    // This is a placeholder implementation
    // In a real application, you would use libraries like:
    // - PDF: puppeteer, jsPDF, or similar
    // - Image: canvas, sharp, or similar
    
    const ticketData = {
      ticketNumber: ticket.ticket_number,
      eventTitle: ticket.event_title,
      eventDate: ticket.event_date,
      eventTime: ticket.start_time,
      venue: ticket.location,
      ticketType: ticket.ticket_type,
      price: ticket.price,
      qrCode: ticket.ticket_number // Use ticket number as QR code for now
    };

    if (format === 'pdf') {
      // Return a simple text representation for now
      return Buffer.from(JSON.stringify(ticketData, null, 2));
    } else {
      // Return a simple image representation for now
      return Buffer.from('PNG placeholder');
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
