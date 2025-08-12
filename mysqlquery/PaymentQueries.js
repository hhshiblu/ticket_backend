const db = require('../db/database');

class PaymentQueries {
  constructor() {
    this.db = db;
  }

  async getAllPayments(page = 1, limit = 10, filters = {}) {
    let sql = `
      SELECT 
        p.*,
        u.name as user_name,
        u.email as user_email,
        e.title as event_title,
        v.name as vendor_name
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN events e ON p.event_id = e.id
      LEFT JOIN vendors v ON e.vendor_id = v.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.status) {
      sql += ` AND p.status = ?`;
      params.push(filters.status);
    }
    
    if (filters.method) {
      sql += ` AND p.payment_method = ?`;
      params.push(filters.method);
    }
    
    if (filters.date_from) {
      sql += ` AND DATE(p.created_at) >= ?`;
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      sql += ` AND DATE(p.created_at) <= ?`;
      params.push(filters.date_to);
    }
    
    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    
    const offset = (page - 1) * limit;
    params.push(limit, offset);
    
    return await this.db.query(sql, params);
  }

  async getPaymentById(id) {
    const sql = `
      SELECT 
        p.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        e.title as event_title,
        e.event_date,
        v.name as vendor_name,
        v.email as vendor_email
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN events e ON p.event_id = e.id
      LEFT JOIN vendors v ON e.vendor_id = v.id
      WHERE p.id = ?
    `;
    
    const result = await this.db.query(sql, [id]);
    return result[0];
  }

  async createPayment(paymentData) {
    const sql = `
      INSERT INTO payments (
        user_id, event_id, amount, payment_method, 
        transaction_id, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      paymentData.user_id,
      paymentData.event_id,
      paymentData.amount,
      paymentData.payment_method,
      paymentData.transaction_id,
      paymentData.status || 'pending'
    ];
    
    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async updatePaymentStatus(id, status) {
    const sql = `UPDATE payments SET status = ?, updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [status, id]);
  }

  async getVendorEarnings(vendorId, filters = {}) {
    let sql = `
      SELECT 
        p.*,
        e.title as event_title,
        u.name as user_name
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE e.vendor_id = ? AND p.status = 'completed'
    `;
    
    const params = [vendorId];
    
    if (filters.date_from) {
      sql += ` AND DATE(p.created_at) >= ?`;
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      sql += ` AND DATE(p.created_at) <= ?`;
      params.push(filters.date_to);
    }
    
    sql += ` ORDER BY p.created_at DESC`;
    
    return await this.db.query(sql, params);
  }

  async getWithdrawalRequests(status = '', page = 1, limit = 10) {
    let sql = `
      SELECT 
        w.*,
        v.name as vendor_name,
        v.email as vendor_email,
        v.phone as vendor_phone
      FROM withdrawals w
      LEFT JOIN vendors v ON w.vendor_id = v.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      sql += ` AND w.status = ?`;
      params.push(status);
    }
    
    sql += ` ORDER BY w.created_at DESC LIMIT ? OFFSET ?`;
    
    const offset = (page - 1) * limit;
    params.push(limit, offset);
    
    return await this.db.query(sql, params);
  }

  async createWithdrawalRequest(withdrawalData) {
    const sql = `
      INSERT INTO withdrawals (
        vendor_id, amount, bank_details, status, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      withdrawalData.vendor_id,
      withdrawalData.amount,
      withdrawalData.bank_details,
      withdrawalData.status || 'pending'
    ];
    
    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async processWithdrawal(withdrawalId, status, processedBy) {
    const sql = `
      UPDATE withdrawals 
      SET status = ?, processed_by = ?, processed_at = NOW(), updated_at = NOW() 
      WHERE id = ?
    `;
    
    return await this.db.query(sql, [status, processedBy, withdrawalId]);
  }

  async getPaymentStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND status = 'completed' THEN amount ELSE 0 END) as revenue_30_days
      FROM payments
    `;
    
    const result = await this.db.query(sql);
    return result[0];
  }

  async getVendorPaymentStats(vendorId) {
    const sql = `
      SELECT 
        COUNT(p.id) as total_payments,
        SUM(p.amount) as total_revenue,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_payments,
        SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as completed_revenue
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      WHERE e.vendor_id = ?
    `;
    
    const result = await this.db.query(sql, [vendorId]);
    return result[0];
  }

  async getUserPayments(userId, page = 1, limit = 10) {
    const sql = `
      SELECT 
        p.*,
        e.title as event_title,
        e.event_date,
        e.location
      FROM payments p
      LEFT JOIN events e ON p.event_id = e.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const offset = (page - 1) * limit;
    return await this.db.query(sql, [userId, limit, offset]);
  }
}

module.exports = PaymentQueries;
