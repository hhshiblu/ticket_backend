const express = require("express");
const OrderController = require("../controllers/OrderController");

const router = express.Router();
const orderController = new OrderController();

// Create new order
router.post("/", orderController.createOrder.bind(orderController));

// Get all orders with filters
router.get("/", orderController.getAllOrders.bind(orderController));

// Get order by ID
router.get("/:id", orderController.getOrderById.bind(orderController));

// Update order status
router.patch(
  "/:id/status",
  orderController.updateOrderStatus.bind(orderController)
);

// Get user orders
router.get(
  "/user/:userId",
  orderController.getUserOrders.bind(orderController)
);

// Get event orders
router.get(
  "/event/:eventId",
  orderController.getEventOrders.bind(orderController)
);

module.exports = router;
