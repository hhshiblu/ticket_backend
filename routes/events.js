const express = require("express");
const EventController = require("../controllers/EventController");
const upload = require("../middleware/upload");

const router = express.Router();
const eventController = new EventController();

// Get all events with filters
router.get("/", eventController.getAllEvents.bind(eventController));

// Search events
router.get("/search", eventController.searchEvents.bind(eventController));

// Get vendor events
router.get(
  "/vendor/my-events",
  eventController.getVendorEvents.bind(eventController)
);

// Get event stats
router.get(
  "/vendor/stats",
  eventController.getEventStats.bind(eventController)
);

// Get event earnings
router.get(
  "/vendor/earnings",
  eventController.getEventEarnings.bind(eventController)
);

// Get ticket sales analysis
router.get(
  "/vendor/sales-analysis",
  eventController.getTicketSalesAnalysis.bind(eventController)
);

// Get event by ID
router.get("/:id", eventController.getEventById.bind(eventController));

// Create new event with file upload
router.post(
  "/",
  upload.single("image"),
  eventController.createEvent.bind(eventController)
);

// Update event
router.put("/:id", eventController.updateEvent.bind(eventController));

// Update event status (admin only)
router.patch(
  "/:id/status",
  eventController.updateEventStatus.bind(eventController)
);

// Delete event
router.delete("/:id", eventController.deleteEvent.bind(eventController));

module.exports = router;
