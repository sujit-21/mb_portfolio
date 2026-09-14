const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manish_portfolio';

const initialProfile = {
  name: 'Manish',
  profilePicture: '',
  heroTagline: 'Video Editor',
  heroHeading: {
    part1: 'Craft the',
    highlight: 'Perfect',
    part2: 'Frame.',
  },
  heroSubtext:
    'I transform raw footage into compelling cinematic narratives. With over 2 years of experience in commercial, documentary, and creative video editing.',
  showreelLabel: 'Play Showreel',
  showreelVideoUrl: '',
  experienceYears: '2+',
  projectsDelivered: '120+',
  viewsGenerated: '40M+',
  clientSatisfaction: '98%',
  aboutTagline: 'The Craft Behind the Cut',
  aboutBio1:
    "I'm Manish, a freelance video editor based in Mumbai, working with brands, filmmakers, and content creators to bring stories to life. I started in broadcast television, cut my teeth on documentary series, and now work across commercial, narrative, and digital formats.",
  aboutBio2:
    'My approach is simple: understand the story first, then find the edit. Good editing is invisible — you feel it before you see it. I work closely with clients from rough cut to final delivery, making sure every frame earns its place.',
  skills: [
    'Adobe Premiere Pro',
    'DaVinci Resolve Studio',
    'After Effects',
    'Final Cut Pro X',
    'Narrative Editing',
    'Broadcast Standards',
    'Remote Collaboration',
    'Multi-cam Editing',
  ],
  email: 'manish.edit@portfolio.dev',
  socialLinks: [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    {
      name: 'WhatsApp',
      url: "https://api.whatsapp.com/send?phone=+918102951819&text=Hello,%20I'm%20interested%20in%20your%20services",
    },
    { name: 'YouTube', url: 'https://youtube.com' },
  ],
  socials: {
    instagram: 'https://instagram.com',
    vimeo: 'https://vimeo.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
};

const initialProjects = [];

const initialServices = [];

const initialTestimonials = [];

const initialMessages = [];

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Seeding initial data for Manish Portfolio...');

    // Clear existing
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Message.deleteMany({});

    // Insert new
    await Profile.create(initialProfile);
    console.log('✓ Profile seeded');

    if (initialProjects.length) await Project.insertMany(initialProjects);
    console.log(`✓ ${initialProjects.length} Projects seeded`);

    await Service.insertMany(initialServices);
    console.log(`✓ ${initialServices.length} Services seeded`);

    if (initialTestimonials.length) await Testimonial.insertMany(initialTestimonials);
    console.log(`✓ ${initialTestimonials.length} Testimonials seeded`);

    if (initialMessages.length) await Message.insertMany(initialMessages);
    console.log(`✓ ${initialMessages.length} Messages seeded`);

    console.log('====================================================');
    console.log('🎉 Database seeding complete!');
    console.log('Open MongoDB Compass and view the "manish_portfolio" database:');
    console.log('Collections created:');
    console.log('  - profiles');
    console.log('  - projects');
    console.log('  - services');
    console.log('  - testimonials');
    console.log('  - messages');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
