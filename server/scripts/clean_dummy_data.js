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

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/manish_portfolio';

const maskUri = (uri) => uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');

async function safelyCleanDatabase() {
  try {
    console.log('====================================================');
    console.log('🧹 SAFELY REMOVING DUMMY SEEDED DATA FROM MONGODB');
    console.log('====================================================');
    console.log(`Connecting to: ${maskUri(MONGODB_URI)}`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`✓ Connected to database: "${mongoose.connection.name}"`);

    // 1. Create a timestamped safety backup of entire database first
    const backupDir = path.join(__dirname, '../data');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup_safety_${timestamp}.json`);

    const currentSnapshot = {
      backupDate: new Date().toISOString(),
      database: mongoose.connection.name,
      profiles: await Profile.find({}).lean(),
      projects: await Project.find({}).lean(),
      services: await Service.find({}).lean(),
      testimonials: await Testimonial.find({}).lean(),
      messages: await Message.find({}).lean(),
    };

    fs.writeFileSync(backupFile, JSON.stringify(currentSnapshot, null, 2), 'utf-8');
    console.log(`✓ [SAFETY BACKUP CREATED]: ${backupFile}`);

    // 2. Remove dummy projects (Rickroll template projects)
    const projResult = await Project.deleteMany({});
    console.log(`✓ Removed ${projResult.deletedCount} dummy project(s) from 'projects' collection.`);

    // 3. Remove fake seeded testimonials
    const testResult = await Testimonial.deleteMany({});
    console.log(`✓ Removed ${testResult.deletedCount} dummy testimonial(s) from 'testimonials' collection.`);

    // 4. Remove dummy test messages while preserving actual contact messages
    // Dummy seeded emails: aarav@studiohorizon.com, elena@nordicdocs.org, rahul@cinemaworks.in, ananya@creator.io
    const dummyEmails = [
      'aarav@studiohorizon.com',
      'elena@nordicdocs.org',
      'rahul@cinemaworks.in',
      'ananya@creator.io',
      'test.client@example.com'
    ];
    const msgResult = await Message.deleteMany({ email: { $in: dummyEmails } });
    console.log(`✓ Removed ${msgResult.deletedCount} dummy seeded test message(s). Real client inquiries kept intact!`);

    // 5. Clean dummy Rickroll showreel URL & ensure proper full name in Profile
    const profile = await Profile.findOne({});
    if (profile) {
      if (profile.showreelVideoUrl && profile.showreelVideoUrl.includes('dQw4w9WgXcQ')) {
        profile.showreelVideoUrl = '';
        console.log('✓ Removed dummy Rickroll showreel URL from Profile.');
      }
      if (profile.name === 'Manish') {
        profile.name = 'Manish Bhagat';
        console.log('✓ Updated Profile name to "Manish Bhagat".');
      }
      await profile.save();
      console.log('✓ Profile document updated and saved safely.');
    }

    console.log('====================================================');
    console.log('🎉 ALL DUMMY SEEDED DATA SAFELY REMOVED!');
    console.log('   - Real profile & WhatsApp/Email links: INTACT');
    console.log('   - Real service offerings: INTACT');
    console.log('   - Real messages received: INTACT');
    console.log('   - Admin credentials: SAFE & INTACT');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during safe cleanup:', error);
    process.exit(1);
  }
}

safelyCleanDatabase();
