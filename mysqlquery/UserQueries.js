const db = require('../db/database');

class UserQueries {
  constructor() {
    this.db = db;
  }

  async getAllUsers(page = 1, limit = 10, filters = {}) {
    let sql = `
      SELECT 
        u.*,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.status) {
      sql += ` AND u.status = ?`;
      params.push(filters.status);
    }
    
    if (filters.search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    
    const offset = (page - 1) * limit;
    params.push(limit, offset);
    
    return await this.db.query(sql, params);
  }

  async getUserById(id) {
    const sql = `
      SELECT 
        u.*,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_spent,
        COUNT(f.id) as favorite_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      LEFT JOIN favorites f ON u.id = f.user_id
      WHERE u.id = ?
      GROUP BY u.id
    `;
    
    const result = await this.db.query(sql, [id]);
    return result[0];
  }

  async createUser(userData) {
    const sql = `
      INSERT INTO users (
        name, email, phone, password, address, 
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const params = [
      userData.name,
      userData.email,
      userData.phone,
      userData.password,
      userData.address,
      userData.status || 'active'
    ];
    
    const result = await this.db.query(sql, params);
    return result.insertId;
  }

  async updateUser(id, userData) {
    const sql = `
      UPDATE users SET
        name = ?, email = ?, phone = ?, address = ?,
        status = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    const params = [
      userData.name,
      userData.email,
      userData.phone,
      userData.address,
      userData.status,
      id
    ];
    
    return await this.db.query(sql, params);
  }

  async updateUserStatus(id, status) {
    const sql = `UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?`;
    return await this.db.query(sql, [status, id]);
  }

  async deleteUser(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    return await this.db.query(sql, [id]);
  }

  async getUserOrders(userId, page = 1, limit = 10) {
    const sql = `
      SELECT 
        o.*,
        e.title as event_title,
        e.event_date,
        e.location
      FROM orders o
      LEFT JOIN events e ON o.event_id = e.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const offset = (page - 1) * limit;
    return await this.db.query(sql, [userId, limit, offset]);
  }

  async getUserFavorites(userId) {
    const sql = `
      SELECT 
        f.*,
        e.title as event_title,
        e.event_date,
        e.location,
        e.price,
        e.image_url
      FROM favorites f
      LEFT JOIN events e ON f.event_id = e.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    
    return await this.db.query(sql, [userId]);
  }

  async addToFavorites(userId, eventId) {
    const sql = `
      INSERT INTO favorites (user_id, event_id, created_at)
      VALUES (?, ?, NOW())
    `;
    
    return await this.db.query(sql, [userId, eventId]);
  }

  async removeFromFavorites(userId, eventId) {
    const sql = `DELETE FROM favorites WHERE user_id = ? AND event_id = ?`;
    return await this.db.query(sql, [userId, eventId]);
  }

  async getUserStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_30_days
      FROM users
    `;
    
    const result = await this.db.query(sql);
    return result[0];
  }

  async searchUsers(searchTerm) {
    const sql = `
      SELECT 
        u.*,
        COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await this.db.query(sql, [searchPattern, searchPattern, searchPattern]);
  }
}

module.exports = UserQueries;
