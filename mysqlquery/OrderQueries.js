const db = require("../db/database");

class OrderQueries {
  constructor() {
    this.db = db;
  }

  async createOrder(orderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Create order
      const orderSql = `
        INSERT INTO orders (
          user_id, event_id, quantity, total_amount, status, 
          customer_info, payment_method, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const orderParams = [
        orderData.userId || 1, // Can be null for guest orders
        orderData.eventId,
        orderData.quantity,
        orderData.totalAmount,
        orderData.status || "pending",
        JSON.stringify(orderData.customerInfo || {}),
        orderData.paymentMethod || "cash_on_delivery",
      ];

      const orderResult = await this.db.query(orderSql, orderParams);
      const orderId = orderResult.insertId;

      // Create tickets for this order
      if (orderData.ticketId) {
        const ticketSql = `
          INSERT INTO tickets (
            event_id, user_id, order_id, ticket_type_id, 
            ticket_number, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        for (let i = 0; i < orderData.quantity; i++) {
          const ticketNumber = `TKT-${orderId}-${i + 1}`;
          const ticketParams = [
            orderData.eventId,
            orderData.userId || 1,
            orderId,
            orderData.ticketId,
            ticketNumber,
            "active",
          ];
          await this.db.query(ticketSql, ticketParams);
        }
      }

      return {
        orderId: orderId,
        orderNumber: orderNumber,
      };
    } catch (error) {
      console.error("OrderQueries - createOrder error:", error);
      throw error;
    }
  }

  async getAllOrders(filters = {}) {
    try {
      let sql = `
        SELECT 
          o.*,
          e.title as event_title,
          e.event_date,
          e.start_time,
          e.location,
          u.name as customer_name,
          u.email as customer_email
        FROM orders o
        LEFT JOIN events e ON o.event_id = e.id
        LEFT JOIN user u ON o.user_id = u.id
        WHERE 1=1
      `;

      const params = [];

      if (filters.status) {
        sql += ` AND o.status = ?`;
        params.push(filters.status);
      }

      if (filters.eventId) {
        sql += ` AND o.event_id = ?`;
        params.push(filters.eventId);
      }

      if (filters.userId) {
        sql += ` AND o.user_id = ?`;
        params.push(filters.userId);
      }

      sql += ` ORDER BY o.created_at DESC`;

      const result = await this.db.query(sql, params);
      return result;
    } catch (error) {
      console.error("OrderQueries - getAllOrders error:", error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const sql = `
        SELECT 
          o.*,
          e.title as event_title,
          e.event_date,
          e.start_time,
          e.location,
          e.image_url,
          u.name as customer_name,
          u.email as customer_email,
          tt.type as ticket_type,
          tt.price as ticket_price
        FROM orders o
        LEFT JOIN events e ON o.event_id = e.id
        LEFT JOIN user u ON o.user_id = u.id
        LEFT JOIN tickets t ON o.id = t.order_id
        LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
        WHERE o.id = ?
        LIMIT 1
      `;

      const result = await this.db.query(sql, [id]);
      const order = result[0];

      if (order) {
        // Parse customer info JSON
        if (order.customer_info) {
          try {
            order.customer_info = JSON.parse(order.customer_info);
          } catch (e) {
            order.customer_info = {};
          }
        }

        // Get tickets for this order
        const ticketsSql = `
          SELECT 
            t.*,
            tt.type as ticket_type,
            tt.price as ticket_price
          FROM tickets t
          LEFT JOIN ticket_types tt ON t.ticket_type_id = tt.id
          WHERE t.order_id = ?
        `;
        const tickets = await this.db.query(ticketsSql, [id]);
        order.tickets = tickets;
      }

      return order;
    } catch (error) {
      console.error("OrderQueries - getOrderById error:", error);
      throw error;
    }
  }

  async updateOrderStatus(id, status) {
    try {
      const sql = `
        UPDATE orders 
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const result = await this.db.query(sql, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("OrderQueries - updateOrderStatus error:", error);
      throw error;
    }
  }

  async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const sql = `
        SELECT 
          o.*,
          e.title as event_title,
          e.event_date,
          e.start_time,
          e.location,
          e.image_url
        FROM orders o
        LEFT JOIN events e ON o.event_id = e.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `;

      const result = await this.db.query(sql, [1]);

      // Parse customer info for each order
      result.forEach((order) => {
        if (order.customer_info) {
          try {
            order.customer_info = JSON.parse(order.customer_info);
          } catch (e) {
            order.customer_info = {};
          }
        }
      });

      return result;
    } catch (error) {
      console.error("OrderQueries - getUserOrders error:", error);
      throw error;
    }
  }

  async getEventOrders(eventId, page = 1, limit = 10) {
    try {
      const sql = `
        SELECT 
          o.*,
          u.name as customer_name,
          u.email as customer_email
        FROM orders o
        LEFT JOIN user u ON o.user_id = u.id
        WHERE o.event_id = ?
        ORDER BY o.created_at DESC
      `;

      const result = await this.db.query(sql, [eventId]);

      // Parse customer info for each order
      result.forEach((order) => {
        if (order.customer_info) {
          try {
            order.customer_info = JSON.parse(order.customer_info);
          } catch (e) {
            order.customer_info = {};
          }
        }
      });

      return result;
    } catch (error) {
      console.error("OrderQueries - getEventOrders error:", error);
      throw error;
    }
  }

  async getOrderStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
          SUM(CASE WHEN status = 'confirmed' THEN total_amount ELSE 0 END) as total_revenue
        FROM orders
      `;

      const result = await this.db.query(sql);
      return result[0];
    } catch (error) {
      console.error("OrderQueries - getOrderStats error:", error);
      throw error;
    }
  }
}

module.exports = OrderQueries;
