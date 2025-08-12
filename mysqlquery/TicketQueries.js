const db = require("../db/database");

class TicketQueries {
  constructor() {
    this.db = db;
  }

  async createTicket(ticketData) {
    const sql = `
      INSERT INTO ticket_types (
        event_id, type, price, quantity, features, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      ticketData.event_id,
      ticketData.type,
      ticketData.price,
      ticketData.quantity,
      JSON.stringify(ticketData.features || []),
    ];

    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async createMultipleTickets(eventId, tickets) {
    const ticketIds = [];

    for (const ticket of tickets) {
      const ticketId = await this.createTicket({
        ...ticket,
        event_id: eventId,
      });
      ticketIds.push(ticketId);
    }

    return ticketIds;
  }

  async getEventTickets(eventId) {
    const sql = `
      SELECT * FROM ticket_types 
      WHERE event_id = ? 
      ORDER BY price ASC
    `;

    return await this.db.query(sql, [eventId]);
  }

  async updateTicket(id, ticketData) {
    const sql = `
      UPDATE ticket_types SET
        type = ?, price = ?, quantity = ?, features = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const params = [
      ticketData.type,
      ticketData.price,
      ticketData.quantity,
      JSON.stringify(ticketData.features || []),
      id,
    ];

    return await this.db.query(sql, params);
  }

  async deleteTicket(id) {
    const sql = `DELETE FROM ticket_types WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async deleteEventTickets(eventId) {
    const sql = `DELETE FROM ticket_types WHERE event_id = ?`;
    return await this.db.query(sql, [eventId]);
  }

  async getTicketById(id) {
    const sql = `
      SELECT 
        t.*,
        e.title as event_title,
        e.event_date,
        e.start_time,
        e.location,
        e.image_url,
        tt.type as ticket_type,
        tt.price,
        o.total_amount,
        o.status as order_status
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
      LEFT JOIN orders o ON t.order_id = o.id
      WHERE t.id = ?
    `;
    const result = await this.db.query(sql, [id]);
    return result[0];
  }

  async getUserTickets(userId) {
    const sql = `
      SELECT 
        t.id,
        t.ticket_number,
        t.status,
        t.created_at as purchase_date,
        e.title as event_title,
        e.event_date,
        e.start_time,
        e.location,
        e.image_url,
        tt.type as ticket_type,
        tt.price,
        o.total_amount,
        o.status as order_status,
        o.quantity
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
      LEFT JOIN orders o ON t.order_id = o.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
    `;

    return await this.db.query(sql, [1]);
  }

  async updateTicketQuantity(id, quantity) {
    const sql = `UPDATE ticket_types SET quantity = ?, updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [quantity, id]);
  }

  // New methods for sold tickets (purchased tickets)
  async getVendorSoldTickets(vendorId) {
    const sql = `
      SELECT 
        t.id,
        t.ticket_number,
        t.status,
        t.created_at as purchase_date,
        e.title as event_title,
        e.event_date,
        e.start_time,
        e.location as venue,
        e.image_url,
        tt.type as ticket_type,
        tt.price,
        u.name as buyer_name,
        u.email as buyer_email,
        o.quantity,
        o.total_amount,
        o.status as order_status
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN ticket_types tt ON t.ticket_type_id = tt.id
      JOIN User u ON t.user_id = u._id
      JOIN orders o ON t.order_id = o.id
      WHERE e.vendor_id = ?
      ORDER BY t.created_at DESC
    `;

    return await this.db.query(sql, [vendorId]);
  }

  async getVendorTicketStats(vendorId) {
    const sql = `
      SELECT 
        COUNT(t.id) as total_tickets,
        SUM(CASE WHEN t.status = 'active' THEN 1 ELSE 0 END) as active_tickets,
        SUM(CASE WHEN t.status = 'used' THEN 1 ELSE 0 END) as used_tickets,
        SUM(CASE WHEN t.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_tickets,
        COALESCE(SUM(o.total_amount), 0) as total_revenue
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN orders o ON t.order_id = o.id
      WHERE e.vendor_id = ?
    `;

    return await this.db.query(sql, [vendorId]);
  }

  async getVendorTicketStatsByStatus(vendorId) {
    const sql = `
      SELECT 
        COUNT(t.id) as total_tickets,
        SUM(CASE WHEN o.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_tickets,
        SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pending_tickets,
        SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_tickets,
        COALESCE(SUM(o.total_amount), 0) as total_revenue
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN orders o ON t.order_id = o.id
      WHERE e.vendor_id = ?
    `;

    return await this.db.query(sql, [vendorId]);
  }
}

module.exports = TicketQueries;
