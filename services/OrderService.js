const OrderQueries = require("../mysqlquery/OrderQueries");

class OrderService {
  constructor() {
    this.orderQueries = new OrderQueries();
  }

  async createOrder(orderData) {
    try {
      // Validate required fields
      const requiredFields = ["eventId", "quantity", "totalAmount"];
      for (const field of requiredFields) {
        if (!orderData[field]) {
          return {
            success: false,
            message: `${field} is required`,
          };
        }
      }

      // Validate quantity
      if (orderData.quantity <= 0) {
        return {
          success: false,
          message: "Quantity must be greater than 0",
        };
      }

      // Validate total amount
      if (orderData.totalAmount <= 0) {
        return {
          success: false,
          message: "Total amount must be greater than 0",
        };
      }

      // Create order with customer info
      const result = await this.orderQueries.createOrder(orderData);

      return {
        success: true,
        data: {
          orderId: result.orderId,
          orderNumber: result.orderNumber,
        },
        message: "Order created successfully",
      };
    } catch (error) {
      console.error("OrderService - createOrder error:", error);
      return {
        success: false,
        message: "Failed to create order",
        error: error.message,
      };
    }
  }

  async getAllOrders(filters = {}) {
    try {
      const orders = await this.orderQueries.getAllOrders(filters);
      return {
        success: true,
        data: orders,
        message: "Orders fetched successfully",
      };
    } catch (error) {
      console.error("OrderService - getAllOrders error:", error);
      return {
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      };
    }
  }

  async getOrderById(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Order ID is required",
        };
      }

      const order = await this.orderQueries.getOrderById(id);

      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      return {
        success: true,
        data: order,
        message: "Order fetched successfully",
      };
    } catch (error) {
      console.error("OrderService - getOrderById error:", error);
      return {
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      };
    }
  }

  async updateOrderStatus(id, status) {
    try {
      if (!id) {
        return {
          success: false,
          message: "Order ID is required",
        };
      }

      if (!status) {
        return {
          success: false,
          message: "Status is required",
        };
      }

      // Validate status
      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message:
            "Invalid status. Must be one of: pending, confirmed, cancelled",
        };
      }

      const result = await this.orderQueries.updateOrderStatus(id, status);

      if (!result) {
        return {
          success: false,
          message: "Order not found",
        };
      }

      return {
        success: true,
        message: "Order status updated successfully",
      };
    } catch (error) {
      console.error("OrderService - updateOrderStatus error:", error);
      return {
        success: false,
        message: "Failed to update order status",
        error: error.message,
      };
    }
  }

  async getUserOrders(userId, page = 1, limit = 10) {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const orders = await this.orderQueries.getUserOrders(userId, page, limit);
      return {
        success: true,
        data: orders,
        message: "User orders fetched successfully",
      };
    } catch (error) {
      console.error("OrderService - getUserOrders error:", error);
      return {
        success: false,
        message: "Failed to fetch user orders",
        error: error.message,
      };
    }
  }

  async getEventOrders(eventId, page = 1, limit = 10) {
    try {
      if (!eventId) {
        return {
          success: false,
          message: "Event ID is required",
        };
      }

      const orders = await this.orderQueries.getEventOrders(
        eventId,
        page,
        limit
      );
      return {
        success: true,
        data: orders,
        message: "Event orders fetched successfully",
      };
    } catch (error) {
      console.error("OrderService - getEventOrders error:", error);
      return {
        success: false,
        message: "Failed to fetch event orders",
        error: error.message,
      };
    }
  }
}

module.exports = OrderService;
