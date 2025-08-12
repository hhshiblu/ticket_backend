const db = require("../db/database");

class VendorQueries {
  constructor() {
    this.db = db;
  }

  async getAllVendors(page = 1, limit = 10, filters = {}) {
    let sql = `
      SELECT 
        v.*,
        COUNT(e.id) as event_count,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_events
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      WHERE 1=1
    `;

    const params = [];

    if (filters.status) {
      sql += ` AND v.status = ?`;
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ` AND (v.name LIKE ? OR v.email LIKE ? OR v.phone LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    sql += ` GROUP BY v.id ORDER BY v.created_at DESC LIMIT ? OFFSET ?`;

    const offset = (page - 1) * limit;
    params.push(limit, offset);

    return await this.db.query(sql, params);
  }

  async getVendorById(vendorId) {
    const sql = `
      SELECT 
        v.*,
        COALESCE(COUNT(DISTINCT e.id), 0) as total_events,
        COALESCE(COUNT(DISTINCT t.id), 0) as total_tickets,
        COALESCE(SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END), 0) as active_events,
        COALESCE(SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END), 0) as completed_events
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      LEFT JOIN tickets t ON e.id = t.event_id
      WHERE v.id = ?
      GROUP BY v.id
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async createVendor(vendorData) {
    const sql = `
      INSERT INTO vendors (
        name, email, phone, address, company_name, 
        business_type, event_types, experience, description,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [
      vendorData.name,
      vendorData.email,
      vendorData.phone,
      vendorData.address,
      vendorData.company_name,
      vendorData.business_type,
      JSON.stringify(vendorData.event_types || []),
      vendorData.experience,
      vendorData.description,
      vendorData.status || "pending",
    ];

    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async updateVendor(vendorId, vendorData) {
    const sql = `
      UPDATE vendors 
      SET 
        name = ?,
        email = ?,
        phone = ?,
        address = ?,
        company_name = ?,
        business_type = ?,
        event_types = ?,
        experience = ?,
        description = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
    `;
    const params = [
      vendorData.name,
      vendorData.email,
      vendorData.phone,
      vendorData.address,
      vendorData.company_name,
      vendorData.business_type,
      JSON.stringify(vendorData.event_types || []),
      vendorData.experience,
      vendorData.description,
      vendorData.status,
      vendorId,
    ];
    return await this.db.query(sql, params);
  }

  async approveVendor(id) {
    const sql = `UPDATE vendors SET status = 'approved', updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async suspendVendor(id) {
    const sql = `UPDATE vendors SET status = 'suspended', updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async deleteVendor(id) {
    const sql = `DELETE FROM vendors WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async getVendorDashboard(vendorId) {
    const sql = `
      SELECT 
        v.*,
        COUNT(e.id) as total_events,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_events,
        COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as pending_events,
        COUNT(t.id) as total_tickets
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      LEFT JOIN tickets t ON e.id = t.event_id
      WHERE v.id = ?
      GROUP BY v.id
    `;

    const result = await this.db.query(sql, [vendorId]);
    return result[0];
  }

  async getVendorsByStatus(status) {
    const sql = `
      SELECT 
        v.*,
        COUNT(e.id) as event_count
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      WHERE v.status = ?
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `;

    return await this.db.query(sql, [status]);
  }

  async searchVendors(searchTerm) {
    const sql = `
      SELECT 
        v.*,
        COUNT(e.id) as event_count
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      WHERE v.name LIKE ? OR v.email LIKE ? OR v.company_name LIKE ?
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `;

    const searchPattern = `%${searchTerm}%`;
    return await this.db.query(sql, [
      searchPattern,
      searchPattern,
      searchPattern,
    ]);
  }

  async getVendorStats(vendorId) {
    const sql = `
      SELECT 
        COALESCE(COUNT(DISTINCT e.id), 0) as total_events,
        COALESCE(SUM(CASE WHEN e.status = 'active' THEN 1 ELSE 0 END), 0) as active_events,
        COALESCE(SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END), 0) as completed_events,
        COALESCE(SUM(CASE WHEN e.status = 'draft' THEN 1 ELSE 0 END), 0) as draft_events,
        COALESCE(COUNT(DISTINCT t.id), 0) as total_tickets_sold
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      LEFT JOIN tickets t ON e.id = t.event_id
      WHERE v.id = ?
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getVendorWithEvents(vendorId) {
    const sql = `
      SELECT 
        v.*,
        e.id as event_id,
        e.title as event_title,
        e.event_date,
        e.status as event_status,
        e.capacity,
        COUNT(t.id) as tickets_sold
      FROM vendors v
      LEFT JOIN events e ON v.id = e.vendor_id
      LEFT JOIN tickets t ON e.id = t.event_id
      WHERE v.id = ?
      GROUP BY v.id, e.id
      ORDER BY e.event_date DESC
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getVendorByEmail(email) {
    const sql = `SELECT * FROM vendors WHERE email = ?`;
    return await this.db.query(sql, [email]);
  }
}

module.exports = VendorQueries;
