const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      // No default — credentials must be explicitly seeded into the database
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // No default — credentials must be explicitly seeded into the database
    },
    password: {
      type: String,
      required: true,
      // No default — credentials must be explicitly seeded into the database
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
