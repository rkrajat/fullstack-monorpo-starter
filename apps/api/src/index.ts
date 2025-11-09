import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { apiRateLimiter, authRateLimiter } from "./middleware/rate-limit";
import { log } from "./utils/logger";
import { authRouter } from "./routes/auth";

// Import additional routes here
// import { exampleRouter } from "./routes/example";

const app = express();

// CORS configuration to allow credentials
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

// Apply rate limiting to all routes
app.use(apiRateLimiter);

// Routes
// Authentication routes with stricter rate limiting
app.use("/api/auth", authRateLimiter, authRouter);

// Add additional routes here
// app.use("/api/example", exampleRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// MongoDB connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    log.info("MongoDB connected successfully");
  } catch (error) {
    log.error("MongoDB connection error", error);
    log.warn("Server will continue without database connection");
  }
};

// Start server after connecting to MongoDB
const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(config.port, () => {
    log.info(`API server running on http://localhost:${config.port}`);
    log.info(`Frontend URL: ${config.frontendUrl}`);
    log.info(`Environment: ${config.nodeEnv}`);
  });

  // Configure server timeouts
  server.timeout = 120000; // 2 minutes - overall request timeout
  server.keepAliveTimeout = 65000; // 65 seconds - keep-alive timeout
  server.headersTimeout = 66000; // 66 seconds - headers timeout
};

startServer();
