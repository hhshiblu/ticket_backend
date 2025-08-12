const db = require("../db/database");

class WithdrawalQueries {
  constructor() {
    this.db = db;
  }

  async getVendorWithdrawals(vendorId) {
    const sql = `
      SELECT 
        w.*,
        v.name as vendor_name,
        v.email as vendor_email
      FROM withdrawals w
      LEFT JOIN vendors v ON w.vendor_id = v.id
      WHERE w.vendor_id = ?
      ORDER BY w.created_at DESC
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async getWithdrawalStats(vendorId) {
    const sql = `
      SELECT 
        COUNT(*) as total_withdrawals,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_withdrawals,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_withdrawals,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_withdrawals,
        COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as total_approved_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending_amount
      FROM withdrawals 
      WHERE vendor_id = ?
    `;
    return await this.db.query(sql, [vendorId]);
  }

  async createWithdrawal(withdrawalData) {
    const sql = `
      INSERT INTO withdrawals (vendor_id, amount, bank_details, status)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      withdrawalData.vendor_id,
      withdrawalData.amount,
      JSON.stringify(withdrawalData.bank_details),
      withdrawalData.status || "pending",
    ];
    return await this.db.query(sql, params);
  }

  async updateWithdrawalStatus(id, status, processedBy = null) {
    const sql = `
      UPDATE withdrawals 
      SET status = ?, processed_by = ?, processed_at = NOW()
      WHERE id = ?
    `;
    return await this.db.query(sql, [status, processedBy, id]);
  }

  async getWithdrawalById(id) {
    const sql = `
      SELECT 
        w.*,
        v.name as vendor_name,
        v.email as vendor_email
      FROM withdrawals w
      LEFT JOIN vendors v ON w.vendor_id = v.id
      WHERE w.id = ?
    `;
    return await this.db.query(sql, [id]);
  }
}

module.exports = WithdrawalQueries;
