const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/manish_portfolio';

const maskUri = (uri) => uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

async function seedDatabase() {
  try {
    const isAtlas = MONGODB_URI.includes('mongodb.net') || MONGODB_URI.startsWith('mongodb+srv://');
    console.log(`Connecting to ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}...`);
    console.log(`Target: ${maskUri(MONGODB_URI)}`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✓ Connected to database: "${mongoose.connection.name}"`);

    // Load rich backup data if available
    let backupData = null;
    const backupFilePath = path.join(__dirname, '../data/backup_pre_cleanup.json');
    if (fs.existsSync(backupFilePath)) {
      try {
        backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
        console.log('✓ Found pre-cleanup dataset to seed');
      } catch (e) {
        console.warn('Could not parse backup file, using fallback dataset:', e.message);
      }
    }

    // Default profile
    // Clean Profile without dummy Rickroll links
    const initialProfile = {
      name: 'Manish Bhagat',
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
      email: 'editor.manish18@gmail.com',
      contactChannels: [
        { icon: 'mail', label: 'editor.manish18@gmail.com', url: 'mailto:editor.manish18@gmail.com' },
        { icon: 'instagram', label: '@manish.edit', url: 'https://instagram.com' },
        { icon: 'whatsapp', label: '+91 8102951819', url: 'https://api.whatsapp.com/send?phone=+918102951819' },
      ],
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
    const initialServices = backupData?.services || [];
    const initialTestimonials = [];
    const initialMessages = [];

    // Strip existing _ids so mongoose creates fresh consistent objects or updates cleanly
    const sanitizeDocs = (arr) => arr.map(({ _id, __v, createdAt, updatedAt, ...rest }) => rest);

    // Seed Profile
    await Profile.deleteMany({});
    const { _id, __v, createdAt, updatedAt, ...cleanProfile } = initialProfile;
    await Profile.create(cleanProfile);
    console.log('✓ Profile seeded');

    // Seed Projects
    await Project.deleteMany({});
    if (initialProjects.length) {
      await Project.insertMany(sanitizeDocs(initialProjects));
      console.log(`✓ ${initialProjects.length} Projects seeded`);
    }

    // Seed Services
    await Service.deleteMany({});
    if (initialServices.length) {
      await Service.insertMany(sanitizeDocs(initialServices));
      console.log(`✓ ${initialServices.length} Services seeded`);
    }

    // Seed Testimonials
    await Testimonial.deleteMany({});
    if (initialTestimonials.length) {
      await Testimonial.insertMany(sanitizeDocs(initialTestimonials));
      console.log(`✓ ${initialTestimonials.length} Testimonials seeded`);
    }

    // Seed Messages
    await Message.deleteMany({});
    if (initialMessages.length) {
      await Message.insertMany(sanitizeDocs(initialMessages));
      console.log(`✓ ${initialMessages.length} Messages seeded`);
    }

    console.log('\n====================================================');
    console.log('🎉 MongoDB Atlas seeding complete!');
    console.log(`Database: "${mongoose.connection.name}"`);
    console.log('Collections ready:');
    console.log('  - profiles      : 1');
    console.log(`  - projects      : ${initialProjects.length}`);
    console.log(`  - services      : ${initialServices.length}`);
    console.log(`  - testimonials  : ${initialTestimonials.length}`);
    console.log(`  - messages      : ${initialMessages.length}`);
    console.log('\n  ⚠  Admin credentials are NOT seeded here.');
    console.log('     Run: node scripts/seed-admin.js  to create the admin account.');
    console.log('====================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
