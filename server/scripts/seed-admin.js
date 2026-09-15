#!/usr/bin/env node
/**
 * seed-admin.js
 * ─────────────────────────────────────────────────────────
 * One-time interactive script to create the admin user in
 * MongoDB. Run this ONCE from the Render Shell (or locally).
 *
 * Usage (Render Shell / local terminal):
 *   cd server
 *   node scripts/seed-admin.js
 *
 * The script will prompt for username, email and password
 * interactively — nothing is read from .env or hard-coded.
 * ─────────────────────────────────────────────────────────
 */

'use strict';

const path     = require('path');
const readline = require('readline');
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

// Load only infrastructure env vars (MONGODB_URI, etc.) — NOT credentials
dotenv.config({ path: path.join(__dirname, '../.env') });

const AdminUser = require('../models/AdminUser');

// ── helpers ────────────────────────────────────────────────────────────────

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/**
 * Prompt for a password without echoing characters to the terminal.
 * Falls back to normal readline if the TTY stream doesn't support raw mode.
 */
function promptPassword(question) {
  return new Promise((resolve) => {
    // Attempt to suppress echo using raw mode
    const stdin = process.stdin;
    process.stdout.write(question);

    let password = '';

    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (ch) => {
      ch = ch.toString();
      // Enter key
      if (ch === '\n' || ch === '\r' || ch === '\u0003') {
        if (ch === '\u0003') {
          // Ctrl+C
          process.stdout.write('\n');
          process.exit(0);
        }
        if (stdin.isTTY) stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(password);
      } else if (ch === '\u007F') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(question + '*'.repeat(password.length));
        }
      } else {
        password += ch;
        process.stdout.write('*');
      }
    };

    stdin.on('data', onData);
  });
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/manish_portfolio';

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║        Admin User Setup — Seed Script        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // ── Connect to MongoDB ──────────────────────────────────────────────────
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log(`✓ Connected to MongoDB: "${mongoose.connection.name}"\n`);
  } catch (err) {
    console.error('✗ Could not connect to MongoDB:', err.message);
    process.exit(1);
  }

  // ── Check if admin already exists ──────────────────────────────────────
  const existing = await AdminUser.findOne();
  if (existing) {
    console.log('⚠  An admin user already exists in the database:');
    console.log(`   Username : ${existing.username}`);
    console.log(`   Email    : ${existing.email}`);
    console.log(`   Created  : ${existing.createdAt.toISOString()}\n`);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt(rl, 'Do you want to REPLACE it with a new admin? (yes/no): ');
    rl.close();

    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('\n✓ No changes made. Existing admin kept.\n');
      await mongoose.disconnect();
      process.exit(0);
    }

    await AdminUser.deleteMany({});
    console.log('✓ Existing admin removed. Creating new admin...\n');
  }

  // ── Collect new credentials interactively ──────────────────────────────
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const username = (await prompt(rl, 'Enter admin username : ')).trim();
  const email    = (await prompt(rl, 'Enter admin email    : ')).trim().toLowerCase();
  rl.close();

  if (!username || !email) {
    console.error('\n✗ Username and email cannot be empty.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Password with hidden echo
  const password = await promptPassword('Enter admin password : ');

  if (!password || password.length < 8) {
    console.error('\n✗ Password must be at least 8 characters.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const confirmPassword = await promptPassword('Confirm password    : ');

  if (password !== confirmPassword) {
    console.error('\n✗ Passwords do not match. No changes made.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Save to MongoDB ────────────────────────────────────────────────────
  try {
    await AdminUser.create({
      username,
      email,
      password,
      lastPasswordChange: new Date(),
    });

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║         ✓ Admin Created Successfully         ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log(`  Username : ${username}`);
    console.log(`  Email    : ${email}`);
    console.log(`  Password : ${'*'.repeat(password.length)}\n`);
    console.log('  Credentials are stored ONLY in MongoDB.');
    console.log('  They are NOT in any .env file or source code.\n');
  } catch (err) {
    console.error('\n✗ Failed to create admin:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main();
