const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      default: 'manish',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      default: 'manish.edit@portfolio.dev',
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      default: 'manish@edit2024',
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
