const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    initials: {
      type: String,
      default: 'CL',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);
