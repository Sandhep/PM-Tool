import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { loadRoutes } from './routes/index.js';
import errorHandler from './common/middleware/errorHandler.js';
import apiRateLimiter from './common/middleware/rateLimiter.js';
import connectDB from './common/config/database.js';

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(apiRateLimiter);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect DB
    await connectDB();

    // Load routes dynamically
    await loadRoutes(app);

    // Error handler (should be last middleware)
    app.use(errorHandler);

    // Start listening
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received: closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received: closing MongoDB connection');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
