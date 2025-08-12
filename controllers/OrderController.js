const OrderService = require("../services/OrderService");

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  // Create new order
  async createOrder(req, res) {
    try {
      const orderData = req.body;

      // Validate required fields
      if (!orderData.eventId || !orderData.quantity || !orderData.totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Event ID, quantity, and total amount are required",
        });
      }

      const result = await this.orderService.createOrder(orderData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("OrderController - createOrder error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get all orders with filters
  async getAllOrders(req, res) {
    try {
      const filters = {
        status: req.query.status,
        eventId: req.query.eventId,
        userId: req.query.userId,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const result = await this.orderService.getAllOrders(filters);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("OrderController - getAllOrders error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const result = await this.orderService.getOrderById(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("OrderController - getOrderById error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await this.orderService.updateOrderStatus(id, status);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("OrderController - updateOrderStatus error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get user orders
  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.orderService.getUserOrders(userId, page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("OrderController - getUserOrders error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Get event orders
  async getEventOrders(req, res) {
    try {
      const { eventId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.orderService.getEventOrders(
        eventId,
        page,
        limit
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("OrderController - getEventOrders error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = OrderController;
