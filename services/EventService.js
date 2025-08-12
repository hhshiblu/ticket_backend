const EventQueries = require("../mysqlquery/EventQueries");

class EventService {
  constructor() {
    this.eventQueries = new EventQueries();
  }

  async getAllEvents(filters = {}) {
    try {
      const events = await this.eventQueries.getAllEvents(filters);
      return {
        success: true,
        data: events,
        message: "Events fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getAllEvents error:", error);
      return {
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      };
    }
  }

  async getEventById(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Event ID is required",
        };
      }

      const event = await this.eventQueries.getEventById(id);

      if (!event) {
        return {
          success: false,
          message: "Event not found",
        };
      }

      return {
        success: true,
        data: event,
        message: "Event fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getEventById error:", error);
      return {
        success: false,
        message: "Failed to fetch event",
        error: error.message,
      };
    }
  }

  async createEvent(eventData, vendorId) {
    try {
      // Validate required fields
      const requiredFields = [
        "title",
        "description",
        "category",
        "location",
        "event_date",
        "price",
        "capacity",
      ];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          return {
            success: false,
            message: `${field} is required`,
          };
        }
      }

      // Validate tickets if provided
      const tickets = eventData.tickets || [];
      if (tickets.length > 0) {
        for (const ticket of tickets) {
          if (!ticket.type || !ticket.price || !ticket.quantity) {
            return {
              success: false,
              message: "Each ticket must have type, price, and quantity",
            };
          }

          if (ticket.price <= 0) {
            return {
              success: false,
              message: "Ticket price must be greater than 0",
            };
          }

          if (ticket.quantity <= 0) {
            return {
              success: false,
              message: "Ticket quantity must be greater than 0",
            };
          }
        }
      }

      // Add vendor_id to event data
      eventData.vendor_id = vendorId;

      // Create event with tickets in a transaction
      const result = await this.eventQueries.createEventWithTickets(
        eventData,
        tickets
      );

      return {
        success: true,
        data: {
          eventId: result.eventId,
          ticketIds: result.ticketIds,
        },
        message: "Event created successfully with tickets",
      };
    } catch (error) {
      console.error("EventService - createEvent error:", error);
      return {
        success: false,
        message: "Failed to create event",
        error: error.message,
      };
    }
  }

  async updateEvent(id, eventData, vendorId) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Event ID is required",
        };
      }

      // Check if event exists and belongs to vendor
      const existingEvent = await this.eventQueries.getEventById(id);
      if (!existingEvent) {
        return {
          success: false,
          message: "Event not found",
        };
      }

      if (existingEvent.vendor_id !== vendorId) {
        return {
          success: false,
          message: "Unauthorized to update this event",
        };
      }

      await this.eventQueries.updateEvent(id, eventData);

      return {
        success: true,
        message: "Event updated successfully",
      };
    } catch (error) {
      console.error("EventService - updateEvent error:", error);
      return {
        success: false,
        message: "Failed to update event",
        error: error.message,
      };
    }
  }

  async deleteEvent(id, vendorId, isAdmin = false) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Event ID is required",
        };
      }

      // Check if event exists
      const existingEvent = await this.eventQueries.getEventById(id);
      if (!existingEvent) {
        return {
          success: false,
          message: "Event not found",
        };
      }

      // Check authorization
      if (!isAdmin && existingEvent.vendor_id !== vendorId) {
        return {
          success: false,
          message: "Unauthorized to delete this event",
        };
      }

      await this.eventQueries.deleteEvent(id);

      return {
        success: true,
        message: "Event deleted successfully",
      };
    } catch (error) {
      console.error("EventService - deleteEvent error:", error);
      return {
        success: false,
        message: "Failed to delete event",
        error: error.message,
      };
    }
  }

  async getVendorEvents(vendorId) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const events = await this.eventQueries.getVendorEvents(vendorId);

      return {
        success: true,
        data: events,
        message: "Vendor events fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getVendorEvents error:", error);
      return {
        success: false,
        message: "Failed to fetch vendor events",
        error: error.message,
      };
    }
  }

  async updateEventStatus(id, status) {
    try {
      if (!id || !status) {
        return {
          success: false,
          message: "Event ID and status are required",
        };
      }

      const validStatuses = ["pending", "active", "cancelled", "completed"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Invalid status",
        };
      }

      await this.eventQueries.updateEventStatus(id, status);

      return {
        success: true,
        message: "Event status updated successfully",
      };
    } catch (error) {
      console.error("EventService - updateEventStatus error:", error);
      return {
        success: false,
        message: "Failed to update event status",
        error: error.message,
      };
    }
  }

  async searchEvents(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          success: false,
          message: "Search term must be at least 2 characters",
        };
      }

      const events = await this.eventQueries.searchEvents(searchTerm.trim());

      return {
        success: true,
        data: events,
        message: "Search completed successfully",
      };
    } catch (error) {
      console.error("EventService - searchEvents error:", error);
      return {
        success: false,
        message: "Failed to search events",
        error: error.message,
      };
    }
  }

  async getEventStats(vendorId) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const stats = await this.eventQueries.getEventStats(vendorId);
      return {
        success: true,
        data: stats[0] || {
          total_events: 0,
          active_events: 0,
          pending_events: 0,
          draft_events: 0,
          completed_events: 0,
        },
        message: "Event stats fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getEventStats error:", error);
      return {
        success: false,
        message: "Failed to fetch event stats",
        error: error.message,
      };
    }
  }

  async getEventEarnings(vendorId) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const earnings = await this.eventQueries.getEventEarnings(vendorId);
      return {
        success: true,
        data: earnings,
        message: "Event earnings fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getEventEarnings error:", error);
      return {
        success: false,
        message: "Failed to fetch event earnings",
        error: error.message,
      };
    }
  }

  async getTicketSalesAnalysis(vendorId) {
    try {
      if (!vendorId) {
        return {
          success: false,
          message: "Vendor ID is required",
        };
      }

      const analysis = await this.eventQueries.getTicketSalesAnalysis(vendorId);
      return {
        success: true,
        data: analysis,
        message: "Ticket sales analysis fetched successfully",
      };
    } catch (error) {
      console.error("EventService - getTicketSalesAnalysis error:", error);
      return {
        success: false,
        message: "Failed to fetch ticket sales analysis",
        error: error.message,
      };
    }
  }
}

module.exports = EventService;
