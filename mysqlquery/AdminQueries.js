const db = require("../db/database");

class AdminQueries {
  constructor() {
    this.db = db;
  }

  async ensureConnection() {
    // Connection is now handled automatically in the database class
    return;
  }

  // Get admin dashboard statistics
  async getDashboardStats() {
    try {
      await this.ensureConnection();

      // Get total users and user status breakdown
      const usersStatsResult = await this.db.query(
        `SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
          SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users
         FROM users`
      );

      // Get vendor statistics with breakdown
      const vendorsStatsResult = await this.db.query(
        `SELECT 
          COUNT(*) as total_vendors,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_vendors,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_vendors,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_vendors
         FROM vendors`
      );

      const eventsResult = await this.db.query(
        "SELECT COUNT(*) as total_events FROM events"
      );

      const ticketsResult = await this.db.query(
        "SELECT COUNT(*) as total_tickets FROM tickets"
      );

      const revenueResult = await this.db.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status = 'confirmed'"
      );

      const pendingEventsResult = await this.db.query(
        "SELECT COUNT(*) as pending_events FROM events WHERE status = 'pending'"
      );

      const activeEventsResult = await this.db.query(
        "SELECT COUNT(*) as active_events FROM events WHERE status = 'active'"
      );

      const recentOrdersResult = await this.db.query(
        `SELECT o.*, u.name as buyer_name, e.title as event_title 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         LEFT JOIN events e ON o.event_id = e.id 
         ORDER BY o.created_at DESC 
         LIMIT 5`
      );

      const recentEventsResult = await this.db.query(
        `SELECT e.*, v.name as vendor_name 
         FROM events e 
         LEFT JOIN vendors v ON e.vendor_id = v.id 
         ORDER BY e.created_at DESC 
         LIMIT 5`
      );

      return {
        total_users: usersStatsResult[0].total_users,
        active_users: usersStatsResult[0].active_users,
        inactive_users: usersStatsResult[0].inactive_users,
        suspended_users: usersStatsResult[0].suspended_users,
        total_vendors: vendorsStatsResult[0].total_vendors,
        active_vendors: vendorsStatsResult[0].active_vendors,
        pending_vendors: vendorsStatsResult[0].pending_vendors,
        suspended_vendors: vendorsStatsResult[0].suspended_vendors,
        total_events: eventsResult[0].total_events,
        total_tickets: ticketsResult[0].total_tickets,
        total_revenue: revenueResult[0].total_revenue,
        pending_events: pendingEventsResult[0].pending_events,
        active_events: activeEventsResult[0].active_events,
        recent_orders: recentOrdersResult,
        recent_events: recentEventsResult,
      };
    } catch (error) {
      throw new Error(`Error getting dashboard stats: ${error.message}`);
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      await this.ensureConnection();

      const usersResult = await this.db.query(
        `SELECT u.*, 
                COUNT(DISTINCT o.id) as total_orders,
                COALESCE(SUM(o.total_amount), 0) as total_spent
         FROM users u 
         LEFT JOIN orders o ON u.id = o.user_id 
         GROUP BY u.id 
         ORDER BY u.created_at DESC`
      );

      return {
        users: usersResult,
        total: usersResult.length,
      };
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  // Get all vendors
  async getAllVendors() {
    try {
      await this.ensureConnection();

      const vendorsResult = await this.db.query(
        `SELECT v.*, 
                COUNT(DISTINCT e.id) as total_events,
                COALESCE(SUM(e.capacity), 0) as total_capacity,
                COALESCE(SUM(o.quantity), 0) as total_tickets_sold
         FROM vendors v 
         LEFT JOIN events e ON v.id = e.vendor_id 
         LEFT JOIN orders o ON e.id = o.event_id 
         GROUP BY v.id 
         ORDER BY v.created_at DESC`
      );

      return {
        vendors: vendorsResult,
        total: vendorsResult.length,
      };
    } catch (error) {
      throw new Error(`Error getting vendors: ${error.message}`);
    }
  }

  // Get all events
  async getAllEvents() {
    try {
      await this.ensureConnection();

      const eventsResult = await this.db.query(
        `SELECT e.*, 
                v.name as vendor_name,
                v.email as vendor_email,
                COUNT(DISTINCT t.id) as tickets_sold,
                COALESCE(SUM(o.quantity), 0) as total_quantity_sold
         FROM events e 
         LEFT JOIN vendors v ON e.vendor_id = v.id 
         LEFT JOIN tickets t ON e.id = t.event_id 
         LEFT JOIN orders o ON e.id = o.event_id 
         GROUP BY e.id 
         ORDER BY e.created_at DESC`
      );

      return {
        events: eventsResult,
        total: eventsResult.length,
      };
    } catch (error) {
      throw new Error(`Error getting events: ${error.message}`);
    }
  }

  // Get all tickets
  async getAllTickets() {
    try {
      await this.ensureConnection();

      const ticketsResult = await this.db.query(
        `SELECT t.*, 
                e.title as event_title,
                e.event_date,
                e.start_time,
                e.location,
                u.name as buyer_name,
                u.email as buyer_email,
                v.name as vendor_name,
                tt.type as ticket_type_name,
                tt.price as ticket_price
         FROM tickets t 
         LEFT JOIN events e ON t.event_id = e.id 
         LEFT JOIN users u ON t.user_id = u.id 
         LEFT JOIN vendors v ON e.vendor_id = v.id 
         LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id 
         ORDER BY t.created_at DESC`
      );

      return {
        tickets: ticketsResult,
        total: ticketsResult.length,
      };
    } catch (error) {
      throw new Error(`Error getting tickets: ${error.message}`);
    }
  }

  // Get admin analytics data
  async getAdminAnalytics() {
    try {
      await this.ensureConnection();
      // Revenue analytics
      const revenueResult = await this.db.query(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          SUM(total_amount) as revenue,
          COUNT(*) as orders
         FROM orders 
         WHERE status = 'confirmed' 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m')
         ORDER BY month DESC`
      );

      // Event category analytics
      const categoryResult = await this.db.query(
        `SELECT 
          category,
          COUNT(*) as total_events,
          SUM(capacity) as total_capacity,
          COUNT(DISTINCT vendor_id) as unique_vendors
         FROM events 
         GROUP BY category 
         ORDER BY total_events DESC`
      );

      // Top performing vendors
      const topVendorsResult = await this.db.query(
        `SELECT 
          v.name as vendor_name,
          v.email as vendor_email,
          COUNT(DISTINCT e.id) as total_events,
          COALESCE(SUM(o.quantity), 0) as total_tickets_sold,
          COALESCE(SUM(o.total_amount), 0) as total_revenue
         FROM vendors v 
         LEFT JOIN events e ON v.id = e.vendor_id 
         LEFT JOIN orders o ON e.id = o.event_id 
         GROUP BY v.id 
         ORDER BY total_revenue DESC 
         LIMIT 10`
      );

      // User registration trends
      const userTrendsResult = await this.db.query(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as new_users
         FROM users 
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m')
         ORDER BY month DESC`
      );

      return {
        revenue_analytics: revenueResult,
        category_analytics: categoryResult,
        top_vendors: topVendorsResult,
        user_trends: userTrendsResult,
      };
    } catch (error) {
      throw new Error(`Error getting admin analytics: ${error.message}`);
    }
  }

  // Get all payments and withdrawals
  async getAllPayments() {
    try {
      await this.ensureConnection();

      const paymentsResult = await this.db.query(
        `SELECT 
          'order' as type,
          o.id,
          o.total_amount as amount,
          o.status,
          o.created_at,
          'Online Payment' as payment_method,
          u.name as user_name,
          u.email as user_email,
          e.title as event_title,
          v.name as vendor_name
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         LEFT JOIN events e ON o.event_id = e.id 
         LEFT JOIN vendors v ON e.vendor_id = v.id 
         UNION ALL
         SELECT 
          'withdrawal' as type,
          w.id,
          w.amount,
          w.status,
          w.created_at,
          'Bank Transfer' as payment_method,
          v.name as user_name,
          v.email as user_email,
          'Withdrawal Request' as event_title,
          v.name as vendor_name
         FROM withdrawals w 
         LEFT JOIN vendors v ON w.vendor_id = v.id 
         ORDER BY created_at DESC`
      );

      return {
        payments: paymentsResult,
        total: paymentsResult.length,
      };
    } catch (error) {
      throw new Error(`Error getting payments: ${error.message}`);
    }
  }

  // Update user status
  async updateUserStatus(userId, status) {
    try {
      await this.ensureConnection();
      const result = await this.db.query(
        "UPDATE users SET status = ? WHERE id = ?",
        [status, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating user status: ${error.message}`);
    }
  }

  // Update vendor status
  async updateVendorStatus(vendorId, status) {
    try {
      await this.ensureConnection();
      const result = await this.db.query(
        "UPDATE vendors SET status = ? WHERE id = ?",
        [status, vendorId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating vendor status: ${error.message}`);
    }
  }

  // Update event status
  async updateEventStatus(eventId, status) {
    try {
      await this.ensureConnection();
      const result = await this.db.query(
        "UPDATE events SET status = ? WHERE id = ?",
        [status, eventId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating event status: ${error.message}`);
    }
  }

  // Approve/Reject withdrawal
  async updateWithdrawalStatus(withdrawalId, status, processedAt = null) {
    try {
      await this.ensureConnection();
      const result = await this.db.query(
        "UPDATE withdrawals SET status = ?, processed_at = ? WHERE id = ?",
        [status, processedAt, withdrawalId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating withdrawal status: ${error.message}`);
    }
  }

  // Get system settings
  async getSystemSettings() {
    try {
      await this.ensureConnection();
      const result = await this.db.query(
        "SELECT * FROM system_settings WHERE id = 1"
      );

      if (result.length === 0) {
        // Return default settings if none exist
        return {
          platform_name: "E-Ticketing Platform",
          platform_description:
            "Multi-vendor e-ticketing platform for sports events",
          support_email: "support@etickets.com",
          default_currency: "BDT",
          commission_rate: 5.0,
          max_tickets_per_order: 10,
          auto_approve_events: false,
          require_vendor_verification: true,
          maintenance_mode: false,
          created_at: new Date(),
          updated_at: new Date(),
        };
      }

      return result[0];
    } catch (error) {
      throw new Error(`Error getting system settings: ${error.message}`);
    }
  }

  // Update system settings
  async updateSystemSettings(settings) {
    try {
      await this.ensureConnection();

      const existingSettings = await this.getSystemSettings();

      if (existingSettings.id) {
        // Update existing settings
        const result = await this.db.query(
          `UPDATE system_settings SET 
           platform_name = ?, 
           platform_description = ?, 
           support_email = ?, 
           default_currency = ?, 
           commission_rate = ?, 
           max_tickets_per_order = ?, 
           auto_approve_events = ?, 
           require_vendor_verification = ?, 
           maintenance_mode = ?,
           updated_at = NOW()
           WHERE id = 1`,
          [
            settings.platform_name,
            settings.platform_description,
            settings.support_email,
            settings.default_currency,
            settings.commission_rate,
            settings.max_tickets_per_order,
            settings.auto_approve_events,
            settings.require_vendor_verification,
            settings.maintenance_mode,
          ]
        );

        return result.affectedRows > 0;
      } else {
        // Insert new settings
        const result = await this.db.query(
          `INSERT INTO system_settings (
           platform_name, platform_description, support_email, default_currency,
           commission_rate, max_tickets_per_order, auto_approve_events,
           require_vendor_verification, maintenance_mode, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            settings.platform_name,
            settings.platform_description,
            settings.support_email,
            settings.default_currency,
            settings.commission_rate,
            settings.max_tickets_per_order,
            settings.auto_approve_events,
            settings.require_vendor_verification,
            settings.maintenance_mode,
          ]
        );

        return result.insertId > 0;
      }
    } catch (error) {
      throw new Error(`Error updating system settings: ${error.message}`);
    }
  }

  // Get system statistics
  async getSystemStatistics() {
    try {
      await this.ensureConnection();

      // Get total users
      const usersResult = await this.db.query(
        "SELECT COUNT(*) as total_users FROM users"
      );

      // Get active users (users with status = 'active')
      const activeUsersResult = await this.db.query(
        "SELECT COUNT(*) as active_users FROM users WHERE status = 'active'"
      );

      // Get total events
      const eventsResult = await this.db.query(
        "SELECT COUNT(*) as total_events FROM events"
      );

      // Get active events
      const activeEventsResult = await this.db.query(
        "SELECT COUNT(*) as active_events FROM events WHERE status = 'active'"
      );

      // Get total orders
      const ordersResult = await this.db.query(
        "SELECT COUNT(*) as total_orders FROM orders"
      );

      // Get total revenue
      const revenueResult = await this.db.query(
        "SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status = 'confirmed'"
      );

      // Get total vendors
      const vendorsResult = await this.db.query(
        "SELECT COUNT(*) as total_vendors FROM vendors"
      );

      // Get active vendors
      const activeVendorsResult = await this.db.query(
        "SELECT COUNT(*) as active_vendors FROM vendors WHERE status = 'approved'"
      );

      // Get total tickets sold
      const ticketsSoldResult = await this.db.query(
        "SELECT COALESCE(SUM(quantity), 0) as total_tickets_sold FROM orders WHERE status = 'confirmed'"
      );

      // Get system uptime (simulated - in real scenario this would come from monitoring)
      const uptimeResult = await this.db.query("SELECT '99.9%' as uptime");

      // Get average response time (simulated - in real scenario this would come from monitoring)
      const responseTimeResult = await this.db.query(
        "SELECT '45ms' as response_time"
      );

      return {
        total_users: usersResult[0].total_users,
        active_users: activeUsersResult[0].active_users,
        total_events: eventsResult[0].total_events,
        active_events: activeEventsResult[0].active_events,
        total_vendors: vendorsResult[0].total_vendors,
        active_vendors: activeVendorsResult[0].active_vendors,
        total_orders: ordersResult[0].total_orders,
        total_tickets_sold: ticketsSoldResult[0].total_tickets_sold,
        total_revenue: revenueResult[0].total_revenue,
        uptime: uptimeResult[0].uptime,
        response_time: responseTimeResult[0].response_time,
        system_status: "Online", // This could be dynamic based on actual system health
      };
    } catch (error) {
      throw new Error(`Error getting system statistics: ${error.message}`);
    }
  }
}

module.exports = AdminQueries;
