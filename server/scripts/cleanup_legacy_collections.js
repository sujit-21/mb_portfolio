const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// The legacy collections from Version 1 that are no longer used by Version 2
const LEGACY_COLLECTIONS = ['contacts', 'mydatas', 'abouts', 'users'];

// Active Version 2 collections that MUST NOT be touched
const ACTIVE_COLLECTIONS = [
  'profiles',
  'projects',
  'services',
  'testimonials',
  'messages',
  'adminusers',
];

async function removeLegacyCollectionsSafely() {
  try {
    console.log('=======================================================');
    console.log('🛡️  SAFE LEGACY COLLECTION CLEANUP');
    console.log('=======================================================');

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in server/.env');
    }

    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    const db = mongoose.connection.db;
    console.log(`Connected to database: "${db.databaseName}"`);

    // 1. Fetch current collections
    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);
    console.log('Existing collections in database:', existingCollections);

    // 2. Identify collections to backup and remove
    const toRemove = existingCollections.filter((name) => LEGACY_COLLECTIONS.includes(name));

    if (toRemove.length === 0) {
      console.log('✓ No legacy collections found. Database is already clean!');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`\n📦 Step 1: Backing up ${toRemove.length} legacy collection(s) safely...`);
    const backup = {
      timestamp: new Date().toISOString(),
      database: db.databaseName,
      collections: {},
    };

    for (const name of toRemove) {
      const docs = await db.collection(name).find({}).toArray();
      backup.collections[name] = docs;
      console.log(`   ↳ Backed up "${name}": ${docs.length} document(s)`);
    }

    const backupDir = path.join(__dirname, '../data');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFilePath = path.join(
      backupDir,
      `legacy_v1_backup_${Date.now()}.json`
    );
    fs.writeFileSync(backupFilePath, JSON.stringify(backup, null, 2), 'utf8');
    console.log(`✓ Backup written to: ${backupFilePath}\n`);

    // 3. Drop legacy collections safely
    console.log('🗑️  Step 2: Dropping legacy collections from Atlas...');
    for (const name of toRemove) {
      await db.collection(name).drop();
      console.log(`   ✓ Dropped legacy collection: "${name}"`);
    }

    // 4. Verify remaining collections
    console.log('\n🔍 Step 3: Verifying remaining database collections...');
    const remaining = (await db.listCollections().toArray()).map((c) => c.name);

    console.log('-------------------------------------------------------');
    console.log('Active Collections Remaining in Database:');
    for (const name of remaining) {
      const count = await db.collection(name).countDocuments();
      const status = ACTIVE_COLLECTIONS.includes(name) ? '✓ Active (v2)' : '⚠️ Unexpected';
      console.log(`  ${status} | ${name}: ${count} docs`);
    }
    console.log('-------------------------------------------------------');
    console.log('🎉 Cleanup completed safely with zero data loss!');
    console.log('=======================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err.message);
    process.exit(1);
  }
}

removeLegacyCollectionsSafely();
