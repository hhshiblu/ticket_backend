const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

const adminController = new AdminController();

// Admin Dashboard
router.get(
  "/dashboard/stats",
  adminController.getDashboardStats.bind(adminController)
);

// Admin Analytics
router.get(
  "/analytics",
  adminController.getAdminAnalytics.bind(adminController)
);

// User Management
router.get("/users", adminController.getAllUsers.bind(adminController));
router.put(
  "/users/:userId/status",
  adminController.updateUserStatus.bind(adminController)
);

// Vendor Management
router.get("/vendors", adminController.getAllVendors.bind(adminController));
router.put(
  "/vendors/:vendorId/status",
  adminController.updateVendorStatus.bind(adminController)
);

// Event Management
router.get("/events", adminController.getAllEvents.bind(adminController));
router.put(
  "/events/:eventId/status",
  adminController.updateEventStatus.bind(adminController)
);

// Ticket Management
router.get("/tickets", adminController.getAllTickets.bind(adminController));

// Payment Management
router.get("/payments", adminController.getAllPayments.bind(adminController));

// Withdrawal Management
router.get(
  "/withdrawals",
  adminController.getAllWithdrawals.bind(adminController)
);
router.put(
  "/withdrawals/:withdrawalId/status",
  adminController.updateWithdrawalStatus.bind(adminController)
);

// Get system settings
router.get(
  "/settings",
  adminController.getSystemSettings.bind(adminController)
);

// Update system settings
router.put(
  "/settings",
  adminController.updateSystemSettings.bind(adminController)
);

// Get system statistics
router.get(
  "/statistics",
  adminController.getSystemStatistics.bind(adminController)
);

module.exports = router;
