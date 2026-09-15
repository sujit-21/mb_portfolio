const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Message = require('../models/Message');
const AdminUser = require('../models/AdminUser');
const { sendContactNotification } = require('../services/emailService');

// ==================== HEALTH ====================
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Manish Portfolio API',
    mongoDB: 'Connected',
  });
});

// ==================== PROFILE ====================
router.get('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== PROJECTS ====================
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project removed successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== SERVICES ====================
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service removed', data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== TESTIMONIALS ====================
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, message: 'Testimonial removed', data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== MESSAGES (CONTACT FORM) ====================
// Client public contact submission
router.post('/messages', async (req, res) => {
  try {
    const { name, email, projectType, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message.',
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      projectType: projectType || 'General Inquiry',
      message,
    });

    console.log(`[Contact Form] New message from ${name} <${email}> stored in MongoDB!`);

    // Safely send email notification via Resend
    sendContactNotification({ name, email, projectType, message })
      .then((emailRes) => {
        if (emailRes.success) {
          console.log(`[Contact Form] Email notification sent to admin via Resend (ID: ${emailRes.id})`);
        } else {
          console.warn('[Contact Form] Resend notification not sent:', emailRes.error || emailRes.reason);
        }
      })
      .catch((err) => {
        console.error('[Contact Form] Unexpected error in email notification:', err);
      });

    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been received and saved.",
      data: newMessage,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin view all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin toggle read status
router.patch('/messages/:id/read', async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    msg.status = msg.status === 'read' ? 'unread' : 'read';
    await msg.save();
    res.json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message: 'Message deleted successfully', data: msg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== ADMIN AUTHENTICATION ====================
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || 'super_secret_jwt_key_portfolio_2024';

function generateAuthToken(username) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    user: username,
    role: 'admin',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Date.now()) return null; // expired
    return data;
  } catch {
    return null;
  }
}

async function getAdminUser() {
  const admin = await AdminUser.findOne();
  if (!admin) {
    throw new Error(
      'No admin account found in the database. ' +
      'Please run: node scripts/seed-admin.js on the server to create one.'
    );
  }
  return admin;
}

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide both username and password.' });
    }

    const admin = await getAdminUser();
    const inputUser = username.trim().toLowerCase();
    const isMatch =
      (inputUser === admin.username.toLowerCase() || inputUser === admin.email.toLowerCase()) &&
      password === admin.password;

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid admin username or password.' });
    }

    const token = generateAuthToken(admin.username);
    res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/verify
router.post('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : req.body?.token;
  const valid = verifyAuthToken(token);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
  }
  res.json({ success: true, user: valid });
});

// GET /api/auth/credentials (View current admin credentials in MongoDB)
router.get('/auth/credentials', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : req.query?.token;
    const valid = verifyAuthToken(token);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Valid admin token required.' });
    }

    const admin = await getAdminUser();
    res.json({
      success: true,
      data: {
        username: admin.username,
        email: admin.email,
        password: admin.password,
        lastPasswordChange: admin.lastPasswordChange || admin.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/auth/credentials (Securely update admin password, username, email)
router.put('/auth/credentials', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.split(' ')[1] : req.body?.token;
    const valid = verifyAuthToken(token);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Valid admin token required.' });
    }

    const { currentPassword, newUsername, newEmail, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ success: false, error: 'Current password is required to update credentials.' });
    }

    const admin = await getAdminUser();
    if (currentPassword !== admin.password) {
      return res.status(400).json({ success: false, error: 'Current password does not match.' });
    }

    if (newUsername && newUsername.trim()) {
      admin.username = newUsername.trim();
    }
    if (newEmail && newEmail.trim()) {
      admin.email = newEmail.trim().toLowerCase();
    }
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
      }
      admin.password = newPassword.trim();
      admin.lastPasswordChange = new Date();
    }

    await admin.save();

    // Credentials are stored ONLY in MongoDB — no file sync needed.
    const newToken = generateAuthToken(admin.username);
    res.json({
      success: true,
      token: newToken,
      data: {
        username: admin.username,
        email: admin.email,
        password: admin.password,
        lastPasswordChange: admin.lastPasswordChange,
      },
      message: '✓ Credentials updated successfully in MongoDB and synchronized with server/.env',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const admin = await getAdminUser();
    res.json({
      success: true,
      message: 'Please contact the site owner to reset your password.',
      adminEmail: admin.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
