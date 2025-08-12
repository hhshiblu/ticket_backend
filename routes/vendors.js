const express = require("express");
const VendorController = require("../controllers/VendorController");

const router = express.Router();
const vendorController = new VendorController();

// Create vendor
router.post("/", (req, res) => {
  vendorController.createVendor(req, res);
});

// Get all vendors
router.get("/", (req, res) => {
  vendorController.getAllVendors(req, res);
});

// Get vendor by ID
router.get("/:vendorId", (req, res) => {
  vendorController.getVendorById(req, res);
});

// Get vendor stats
router.get("/:vendorId/stats", (req, res) => {
  vendorController.getVendorStats(req, res);
});

// Update vendor
router.put("/:vendorId", (req, res) => {
  vendorController.updateVendor(req, res);
});

// Get vendor with events
router.get("/:vendorId/events", (req, res) => {
  vendorController.getVendorWithEvents(req, res);
});

// Approve vendor
router.patch("/:vendorId/approve", (req, res) => {
  vendorController.approveVendor(req, res);
});

// Suspend vendor
router.patch("/:vendorId/suspend", (req, res) => {
  vendorController.suspendVendor(req, res);
});

module.exports = router;
