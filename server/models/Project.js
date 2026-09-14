const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Brand Film', 'Documentary', 'Music Video', 'Commercial', 'Short Film', 'Social Content'],
      default: 'Brand Film',
    },
    duration: {
      type: String,
      default: '3:45 min',
    },
    year: {
      type: String,
      default: '2024',
    },
    tag: {
      type: String,
      default: '4K Color Grade',
    },
    description: {
      type: String,
      default: 'Cinematic cut and bespoke color palette tailored to convey visceral narrative impact.',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    layoutSpan: {
      type: String,
      enum: ['large', 'medium', 'wide', 'small'],
      default: 'medium',
    },
    gradientType: {
      type: String,
      default: 'card-bg-1',
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
