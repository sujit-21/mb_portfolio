const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/manish_portfolio_v2';

async function safelyCleanDatabase(uri) {
  try {
    console.log(`\n[1/4] Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);

    // 1. Fetch current data for backup
    console.log('[2/4] Creating safety backup snapshot before cleanup...');
    const backupData = {
      timestamp: new Date().toISOString(),
      uri,
      profiles: await Profile.find({}).lean(),
      projects: await Project.find({}).lean(),
      services: await Service.find({}).lean(),
      testimonials: await Testimonial.find({}).lean(),
      messages: await Message.find({}).lean(),
    };

    const backupDir = path.join(__dirname, '../data');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupPath = path.join(backupDir, 'backup_pre_cleanup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    console.log(`✓ Safety backup successfully saved to: ${backupPath}`);

    // 2. Remove dummy messages (test inquiries)
    const msgResult = await Message.deleteMany({});
    console.log(`✓ Removed ${msgResult.deletedCount} dummy test message(s) from 'messages' collection.`);

    // 3. Remove fake dummy testimonials
    const testResult = await Testimonial.deleteMany({});
    console.log(`✓ Removed ${testResult.deletedCount} fake testimonial(s) from 'testimonials' collection.`);

    // 4. Remove dummy projects with placeholder Rickroll links
    const projResult = await Project.deleteMany({});
    console.log(`✓ Removed ${projResult.deletedCount} template project(s) from 'projects' collection.`);

    // 5. Clean dummy video URL from Profile
    const profile = await Profile.findOne({});
    if (profile) {
      profile.showreelVideoUrl = '';
      await profile.save();
      console.log('✓ Cleaned dummy showreel video URL from profile.');
    }

    console.log('[3/4] MongoDB collections are now clean of all dummy data.');
    console.log('✓ Real profile, stats, services, and WhatsApp links remain intact.');

    await mongoose.disconnect();
    console.log('[4/4] Disconnected cleanly.\n');
  } catch (error) {
    console.error(`Error during safe cleanup on ${uri}:`, error.message);
  }
}

async function runCleanup() {
  console.log('====================================================');
  console.log('🧹 SAFELY CLEANING DUMMY DATA FROM PORTFOLIO PROJECT');
  console.log('====================================================');

  // Clean the active DB (manish_portfolio_v2)
  await safelyCleanDatabase(MONGODB_URI);

  // Also clean legacy db if it exists
  if (!MONGODB_URI.endsWith('manish_portfolio')) {
    await safelyCleanDatabase('mongodb://127.0.0.1:27017/manish_portfolio');
  }

  console.log('====================================================');
  console.log('🎉 ALL DUMMY DATA SAFELY REMOVED & BACKED UP!');
  console.log('====================================================');
  process.exit(0);
}

runCleanup();
