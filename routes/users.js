const express = require("express");
const UserController = require("../controllers/UserController");

const router = express.Router();
const userController = new UserController();

// Get all users with pagination and filters
router.get("/", userController.getAllUsers.bind(userController));

// Search users
router.get("/search", userController.searchUsers.bind(userController));

// Get user statistics
router.get("/stats", userController.getUserStats.bind(userController));

// Get user orders
router.get(
  "/:userId/orders",
  userController.getUserOrders.bind(userController)
);

// Get user favorites
router.get(
  "/:userId/favorites",
  userController.getUserFavorites.bind(userController)
);

// Get user by ID
router.get("/:id", userController.getUserById.bind(userController));

// Create new user
router.post("/", userController.createUser.bind(userController));

// Update user
router.put("/:id", userController.updateUser.bind(userController));

// Update user status
router.patch(
  "/:id/status",
  userController.updateUserStatus.bind(userController)
);

// Delete user
router.delete("/:id", userController.deleteUser.bind(userController));

// Add to favorites
router.post("/favorites", userController.addToFavorites.bind(userController));

// Remove from favorites
router.delete(
  "/favorites",
  userController.removeFromFavorites.bind(userController)
);

module.exports = router;
