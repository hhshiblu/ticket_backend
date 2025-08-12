const express = require("express");
const TicketController = require("../controllers/TicketController");

const router = express.Router();
const ticketController = new TicketController();

// Get tickets for an event
router.get(
  "/event/:eventId",
  ticketController.getEventTickets.bind(ticketController)
);

// Get ticket by ID
router.get("/:id", ticketController.getTicketById.bind(ticketController));

// Create new ticket for an event
router.post(
  "/event/:eventId",
  ticketController.createTicket.bind(ticketController)
);

// Update ticket
router.put("/:id", ticketController.updateTicket.bind(ticketController));

// Delete ticket
router.delete("/:id", ticketController.deleteTicket.bind(ticketController));

// Vendor sold tickets routes
router.get(
  "/vendor/:vendorId/sold",
  ticketController.getVendorSoldTickets.bind(ticketController)
);

router.get(
  "/vendor/:vendorId/stats",
  ticketController.getVendorTicketStats.bind(ticketController)
);

router.get(
  "/vendor/:vendorId/stats/status",
  ticketController.getVendorTicketStatsByStatus.bind(ticketController)
);

module.exports = router;
