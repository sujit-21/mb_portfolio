const mongoose = require('mongoose');

const maskMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/manish_portfolio';
  const isAtlas = uri.includes('mongodb.net') || uri.startsWith('mongodb+srv://');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB] Connected successfully to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
    console.log(`[MongoDB] Host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
    console.log(`[MongoDB] Target: ${maskMongoUri(uri)}`);

    // Setup connection state event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Runtime Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection lost. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Connection re-established.');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
