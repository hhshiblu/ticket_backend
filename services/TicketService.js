const TicketQueries = require("../mysqlquery/TicketQueries");

class TicketService {
  constructor() {
    this.ticketQueries = new TicketQueries();
  }

  async getEventTickets(eventId) {
    try {
      const tickets = await this.ticketQueries.getEventTickets(eventId);
      return { success: true, data: tickets };
    } catch (error) {
      console.error("Error getting event tickets:", error);
      return { success: false, message: "Failed to get event tickets" };
    }
  }

  async createTicket(ticketData) {
    try {
      if (!ticketData.event_id || !ticketData.type || !ticketData.price) {
        return { success: false, message: "Missing required fields" };
      }

      const ticketId = await this.ticketQueries.createTicket(ticketData);
      return { success: true, data: { id: ticketId } };
    } catch (error) {
      console.error("Error creating ticket:", error);
      return { success: false, message: "Failed to create ticket" };
    }
  }

  async updateTicket(id, ticketData) {
    try {
      if (!id) {
        return { success: false, message: "Ticket ID is required" };
      }

      await this.ticketQueries.updateTicket(id, ticketData);
      return { success: true, message: "Ticket updated successfully" };
    } catch (error) {
      console.error("Error updating ticket:", error);
      return { success: false, message: "Failed to update ticket" };
    }
  }

  async deleteTicket(id) {
    try {
      if (!id) {
        return { success: false, message: "Ticket ID is required" };
      }

      await this.ticketQueries.deleteTicket(id);
      return { success: true, message: "Ticket deleted successfully" };
    } catch (error) {
      console.error("Error deleting ticket:", error);
      return { success: false, message: "Failed to delete ticket" };
    }
  }

  async getTicketById(id) {
    try {
      if (!id) {
        return { success: false, message: "Ticket ID is required" };
      }

      const ticket = await this.ticketQueries.getTicketById(id);
      if (!ticket) {
        return { success: false, message: "Ticket not found" };
      }

      return { success: true, data: ticket };
    } catch (error) {
      console.error("Error getting ticket by ID:", error);
      return { success: false, message: "Failed to get ticket" };
    }
  }

  // New methods for vendor sold tickets
  async getVendorSoldTickets(vendorId) {
    try {
      if (!vendorId) {
        return { success: false, message: "Vendor ID is required" };
      }

      const tickets = await this.ticketQueries.getVendorSoldTickets(vendorId);
      return { success: true, data: tickets };
    } catch (error) {
      console.error("Error getting vendor sold tickets:", error);
      return { success: false, message: "Failed to get vendor sold tickets" };
    }
  }

  async getVendorTicketStats(vendorId) {
    try {
      if (!vendorId) {
        return { success: false, message: "Vendor ID is required" };
      }

      const stats = await this.ticketQueries.getVendorTicketStats(vendorId);
      return { success: true, data: stats[0] || {} };
    } catch (error) {
      console.error("Error getting vendor ticket stats:", error);
      return { success: false, message: "Failed to get vendor ticket stats" };
    }
  }

  async getVendorTicketStatsByStatus(vendorId) {
    try {
      if (!vendorId) {
        return { success: false, message: "Vendor ID is required" };
      }

      const stats = await this.ticketQueries.getVendorTicketStatsByStatus(vendorId);
      return { success: true, data: stats[0] || {} };
    } catch (error) {
      console.error("Error getting vendor ticket stats by status:", error);
      return { success: false, message: "Failed to get vendor ticket stats by status" };
    }
  }
}

module.exports = TicketService;
