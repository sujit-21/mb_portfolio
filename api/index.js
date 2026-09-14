const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Try loading local server/.env for local testing, or fallback to system environment variables
try {
  dotenv.config({ path: path.join(__dirname, '../server/.env') });
} catch (e) {
  // In production, Vercel injects environment variables directly
}

// Ensure all Mongoose schemas are registered
require('../server/models/Profile');
require('../server/models/Project');
require('../server/models/Service');
require('../server/models/Testimonial');
require('../server/models/Message');
require('../server/models/AdminUser');

const apiRoutes = require('../server/routes/api');

let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  cachedConnection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  return cachedConnection;
}

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Middleware to ensure DB connection is ready before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('[Vercel Serverless DB Error]:', err.message);
    res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + err.message,
    });
  }
});

// Mount existing API routes
app.use('/api', apiRoutes);

// Root informational endpoint for serverless API
app.get('/', (req, res) => {
  res.json({
    message: 'Manish Portfolio API is running (Vercel Serverless)',
    status: 'online',
  });
});

module.exports = app;
