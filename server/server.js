const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const path = require('path');
// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB (MongoDB Compass accessible at this URI)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow development access
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Manish Portfolio MERN API is running',
    compassStatus: 'Connect MongoDB Compass to mongodb://127.0.0.1:27017/manish_portfolio',
    docs: {
      profile: '/api/profile',
      projects: '/api/projects',
      services: '/api/services',
      testimonials: '/api/testimonials',
      messages: '/api/messages (POST to submit contact inquiry)'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Payload too large. Please upload an image under 15MB.' });
  }
  console.error('[Error Handler]', err.message || err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Listen on port with error handling
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB Database: mongodb://127.0.0.1:27017/manish_portfolio`);
  console.log(`🔍 Open MongoDB Compass and connect to inspect all data!`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Port Error] Port ${PORT} is already in use by another process.`);
    console.error(`👉 To free port ${PORT}, run: npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    console.error(`Server error:`, err);
  }
});

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message || err}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message || err}`);
});
