const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import database connection
const db = require("./db/database");

// Import routes
const eventRoutes = require("./routes/events");
const vendorRoutes = require("./routes/vendors");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const ticketRoutes = require("./routes/tickets");
const withdrawalRoutes = require("./routes/withdrawals");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orders");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each IP to 500 requests per windowMs
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
    });
    this.app.use("/api/", limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Serve static files (uploaded images)
    this.app.use("/uploads", express.static("uploads"));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use("/api/events", eventRoutes);
    this.app.use("/api/vendors", vendorRoutes);
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/payments", paymentRoutes);
    this.app.use("/api/tickets", ticketRoutes);
    this.app.use("/api/withdrawals", withdrawalRoutes);
    this.app.use("/api/admin", adminRoutes);
    this.app.use("/api/orders", orderRoutes);

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error("Global error handler:", error);

      res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      });
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });
  }

  async start() {
    try {
      // Connect to database
      await db.connect();

      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server is running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API Base URL: http://localhost:${this.port}/api`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await db.close();
      console.log("✅ Server stopped gracefully");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error stopping server:", error);
      process.exit(1);
    }
  }
}

// Create and start server
const server = new Server();

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.stop();
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.stop();
});

// Start the server
server.start();
