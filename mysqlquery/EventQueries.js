const db = require("../db/database");

class EventQueries {
  constructor() {
    this.db = db;
  }

  async getAllEvents(filters = {}) {
    let sql = `
      SELECT 
        e.*,
        v.name as vendor_name,
        v.email as vendor_email,
        COUNT(tt.id) as ticket_count
      FROM events e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.category) {
      sql += ` AND e.category = ?`;
      params.push(filters.category);
    }

    if (filters.location) {
      sql += ` AND e.location LIKE ?`;
      params.push(`%${filters.location}%`);
    }

    if (filters.date) {
      sql += ` AND DATE(e.event_date) = ?`;
      params.push(filters.date);
    }

    if (filters.status) {
      sql += ` AND e.status = ?`;
      params.push(filters.status);
    }

    if (filters.vendor_id) {
      sql += ` AND e.vendor_id = ?`;
      params.push(filters.vendor_id);
    }

    sql += ` GROUP BY e.id ORDER BY e.created_at DESC`;

    console.log("EventQueries - getAllEvents SQL:", sql); // Debug log
    console.log("EventQueries - getAllEvents params:", params); // Debug log

    const result = await this.db.query(sql, params);
    console.log("EventQueries - getAllEvents result:", result); // Debug log

    return result;
  }

  async getEventById(id) {
    const sql = `
      SELECT 
        e.*,
        v.name as vendor_name,
        v.email as vendor_email,
        v.phone as vendor_phone,
        COUNT(tt.id) as ticket_count
      FROM events e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `;

    const result = await this.db.query(sql, [id]);
    const event = result[0];

    if (event) {
      // Get tickets for this event
      const ticketsSql = `
        SELECT id, type, price, quantity, features, created_at, updated_at
        FROM ticket_types 
        WHERE event_id = ? 
        ORDER BY price ASC
      `;
      const tickets = await this.db.query(ticketsSql, [id]);

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

      event.tickets = tickets;
    }

    return event;
  }

  async createEvent(eventData) {
    const sql = `
      INSERT INTO events (
        title, description, category, location, event_date, 
        start_time, end_time, price, capacity, vendor_id, 
        image_url, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      eventData.title,
      eventData.description,
      eventData.category,
      eventData.location,
      eventData.event_date,
      eventData.start_time,
      eventData.end_time,
      eventData.price,
      eventData.capacity,
      eventData.vendor_id,
      eventData.image_url,
      eventData.status || "pending",
    ];

    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async createEventWithTickets(eventData, tickets = []) {
    return await this.db.transaction(async (connection) => {
      // Create event
      const eventSql = `
        INSERT INTO events (
          title, description, category, location, event_date, 
          start_time, end_time, price, capacity, vendor_id, 
          image_url, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const eventParams = [
        eventData.title,
        eventData.description,
        eventData.category,
        eventData.location,
        eventData.event_date,
        eventData.start_time,
        eventData.end_time,
        eventData.price,
        eventData.capacity,
        eventData.vendor_id,
        eventData.image_url,
        eventData.status || "pending",
      ];

      const eventResult = await connection.execute(eventSql, eventParams);
      const eventId = eventResult[0].insertId;

      // Create tickets if provided
      const ticketIds = [];
      if (tickets && tickets.length > 0) {
        for (const ticket of tickets) {
          const ticketSql = `
            INSERT INTO ticket_types (
              event_id, type, price, quantity, features, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
          `;

          const ticketParams = [
            eventId,
            ticket.type,
            ticket.price,
            ticket.quantity,
            JSON.stringify(ticket.features || []),
          ];

          const ticketResult = await connection.execute(
            ticketSql,
            ticketParams
          );
          ticketIds.push(ticketResult[0].insertId);
        }
      }

      return {
        eventId,
        ticketIds,
      };
    });
  }

  async updateEvent(id, eventData) {
    const sql = `
      UPDATE events SET
        title = ?, description = ?, category = ?, location = ?,
        event_date = ?, start_time = ?, end_time = ?, price = ?,
        capacity = ?, image_url = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      eventData.title,
      eventData.description,
      eventData.category,
      eventData.location,
      eventData.event_date,
      eventData.start_time,
      eventData.end_time,
      eventData.price,
      eventData.capacity,
      eventData.image_url,
      eventData.status,
      id,
    ];

    return await this.db.query(sql, params);
  }

  async deleteEvent(id) {
    const sql = `DELETE FROM events WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async getVendorEvents(vendorId) {
    const sql = `
      SELECT 
        e.*,
        COUNT(tt.id) as ticket_count
      FROM events e
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      WHERE e.vendor_id = ?
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `;

    return await this.db.query(sql, [vendorId]);
  }

  async updateEventStatus(id, status) {
    const sql = `UPDATE events SET status = ?, updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [status, id]);
  }

  async getEventStats(vendorId) {
    const sql = `
      SELECT 
        COUNT(*) as total_events,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_events,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_events,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_events,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_events
      FROM events 
      WHERE vendor_id = ?
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getEventEarnings(vendorId) {
    const sql = `
      SELECT 
        e.id,
        e.title,
        e.event_date,
        COUNT(t.id) as tickets_sold,
        SUM(o.total_amount) as total_revenue,
        SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_tickets
      FROM events e
      LEFT JOIN tickets t ON e.id = t.event_id
      LEFT JOIN orders o ON e.id = o.event_id
      WHERE e.vendor_id = ?
      GROUP BY e.id, e.title, e.event_date
      ORDER BY e.event_date DESC
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getTicketSalesAnalysis(vendorId) {
    const sql = `
      SELECT 
        e.title,
        tt.type as ticket_type,
        tt.price,
        COUNT(t.id) as tickets_sold,
        SUM(o.total_amount) as revenue,
        DATE(o.created_at) as sale_date
      FROM events e
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      LEFT JOIN tickets t ON tt.id = t.ticket_type_id
      LEFT JOIN orders o ON e.id = o.event_id
      WHERE e.vendor_id = ?
      GROUP BY e.id, e.title, tt.id, tt.type, tt.price, DATE(o.created_at)
      ORDER BY sale_date DESC
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getEventsByStatus(status) {
    const sql = `
      SELECT 
        e.*,
        v.name as vendor_name,
        v.email as vendor_email
      FROM events e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      WHERE e.status = ?
      ORDER BY e.created_at DESC
    `;

    return await this.db.query(sql, [status]);
  }

  async searchEvents(searchTerm) {
    const sql = `
      SELECT 
        e.*,
        v.name as vendor_name,
        COUNT(tt.id) as ticket_count
      FROM events e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      WHERE e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `;

    const searchPattern = `%${searchTerm}%`;
    return await this.db.query(sql, [
      searchPattern,
      searchPattern,
      searchPattern,
    ]);
  }
}

module.exports = EventQueries;
