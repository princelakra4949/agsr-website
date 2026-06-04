// ============================================================
//  AGSR Sonipat — Full Stack Server
//  Node.js + Express + SQLite
//  Run: node server.js
// ============================================================

const express = require('express');
const path    = require('path');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));   // serve HTML/CSS/JS/images

// ── Database Setup (local SQLite only — not available on Vercel) ─
let db = null;
try {
  const Database = require('better-sqlite3');
  db = new Database(path.join(__dirname, 'agsr.db'));

  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      age_group  TEXT,
      discipline TEXT,
      message    TEXT,
      created_at DATETIME DEFAULT (datetime('now','localtime')),
      status     TEXT DEFAULT 'new'
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      filename   TEXT NOT NULL,
      caption    TEXT,
      category   TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      date        TEXT,
      filename    TEXT,
      level       TEXT,
      created_at  DATETIME DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT UNIQUE NOT NULL,
      excerpt     TEXT,
      content     TEXT,
      cover_image TEXT,
      category    TEXT DEFAULT 'general',
      tags        TEXT,
      author      TEXT DEFAULT 'AGSR Team',
      published   INTEGER DEFAULT 0,
      created_at  DATETIME DEFAULT (datetime('now','localtime')),
      updated_at  DATETIME DEFAULT (datetime('now','localtime'))
    );
  `);
  console.log('✅ SQLite database ready');
} catch (e) {
  console.log('ℹ️  SQLite not available — API routes handled by api/payload.js on Vercel');
}

// ── Admin password (change this!) ────────────────────────────
const ADMIN_PASS = 'agsr2024';

// ── ROUTES ────────────────────────────────────────────────────

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ── API: Submit Enquiry ───────────────────────────────────────
app.post('/api/enquiry', (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS API on Vercel.' });
  try {
    const { name, phone, age_group, discipline, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO enquiries (name, phone, age_group, discipline, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, phone, age_group || '', discipline || '', message || '');

    console.log(`✅ New enquiry from ${name} (${phone}) — ID: ${result.lastInsertRowid}`);

    res.json({
      success: true,
      message: '🎯 Enquiry received! We will contact you soon.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── API: Admin Login ──────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS admin on Vercel.' });
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ success: true, token: Buffer.from(ADMIN_PASS).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password.' });
  }
});

// ── Middleware: Verify Admin Token ────────────────────────────
function authAdmin(req, res, next) {
  const auth = req.headers['authorization'] || req.query.token;
  const expected = Buffer.from(ADMIN_PASS).toString('base64');
  if (auth === expected) return next();
  res.status(401).json({ success: false, message: 'Unauthorized' });
}

// ── API: Get All Enquiries (Admin) ────────────────────────────
app.get('/api/admin/enquiries', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const rows = db.prepare(`SELECT * FROM enquiries ORDER BY created_at DESC`).all();
  res.json({ success: true, data: rows, total: rows.length });
});

// ── API: Update Enquiry Status ────────────────────────────────
app.patch('/api/admin/enquiries/:id', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const { status } = req.body;
  const { id } = req.params;
  db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true, message: 'Status updated.' });
});

// ── API: Delete Enquiry ───────────────────────────────────────
app.delete('/api/admin/enquiries/:id', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Enquiry deleted.' });
});

// ── API: Stats (Admin Dashboard) ─────────────────────────────
app.get('/api/admin/stats', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const total    = db.prepare(`SELECT COUNT(*) as n FROM enquiries`).get().n;
  const newQ     = db.prepare(`SELECT COUNT(*) as n FROM enquiries WHERE status='new'`).get().n;
  const followed = db.prepare(`SELECT COUNT(*) as n FROM enquiries WHERE status='followed'`).get().n;
  const enrolled = db.prepare(`SELECT COUNT(*) as n FROM enquiries WHERE status='enrolled'`).get().n;
  const today    = db.prepare(`SELECT COUNT(*) as n FROM enquiries WHERE date(created_at)=date('now','localtime')`).get().n;
  res.json({ success: true, total, new: newQ, followed, enrolled, today });
});

// ── API: Achievements (public) ────────────────────────────────
app.get('/api/achievements', (req, res) => {
  if (!db) return res.json({ success: true, data: [] });
  const rows = db.prepare(`SELECT * FROM achievements ORDER BY created_at DESC`).all();
  res.json({ success: true, data: rows });
});

// ── API: Add Achievement (admin) ─────────────────────────────
app.post('/api/admin/achievements', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const { title, description, date, filename, level } = req.body;
  const result = db.prepare(`
    INSERT INTO achievements (title, description, date, filename, level)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, date, filename, level);
  res.json({ success: true, id: result.lastInsertRowid });
});

// ── BLOG API ──────────────────────────────────────────────────

// GET all published posts (public)
app.get('/api/blog', (req, res) => {
  if (!db) return res.json({ success: true, data: [], total: 0 });
  const { category, limit = 20, offset = 0 } = req.query;
  let query = `SELECT id, title, slug, excerpt, cover_image, category, tags, author, created_at
               FROM blog_posts WHERE published = 1`;
  const params = [];
  if (category && category !== 'all') {
    query += ` AND category = ?`;
    params.push(category);
  }
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  const rows = db.prepare(query).all(...params);
  const total = db.prepare(`SELECT COUNT(*) as n FROM blog_posts WHERE published=1`).get().n;
  res.json({ success: true, data: rows, total });
});

// GET single post by slug (public)
app.get('/api/blog/:slug', (req, res) => {
  if (!db) return res.status(404).json({ success: false, message: 'Post not found.' });
  const row = db.prepare(
    `SELECT * FROM blog_posts WHERE slug = ? AND published = 1`
  ).get(req.params.slug);
  if (!row) return res.status(404).json({ success: false, message: 'Post not found.' });
  res.json({ success: true, data: row });
});

// GET all posts including drafts (admin)
app.get('/api/admin/blog', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const rows = db.prepare(`SELECT * FROM blog_posts ORDER BY created_at DESC`).all();
  res.json({ success: true, data: rows, total: rows.length });
});

// POST create new post (admin)
app.post('/api/admin/blog', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const { title, slug, excerpt, content, cover_image, category, tags, author, published } = req.body;
  if (!title || !slug) return res.status(400).json({ success: false, message: 'Title and slug required.' });
  try {
    const result = db.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, category, tags, author, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, excerpt, content, cover_image, category || 'general', tags, author || 'AGSR Team', published ? 1 : 0);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Slug must be unique.' });
  }
});

// PATCH update post (admin)
app.patch('/api/admin/blog/:id', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  const fields = ['title', 'slug', 'excerpt', 'content', 'cover_image', 'category', 'tags', 'author', 'published'];
  const updates = [];
  const params = [];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      params.push(f === 'published' ? (req.body[f] ? 1 : 0) : req.body[f]);
    }
  });
  if (!updates.length) return res.status(400).json({ success: false, message: 'No fields to update.' });
  updates.push(`updated_at = datetime('now','localtime')`);
  params.push(req.params.id);
  db.prepare(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  res.json({ success: true, message: 'Post updated.' });
});

// DELETE post (admin)
app.delete('/api/admin/blog/:id', authAdmin, (req, res) => {
  if (!db) return res.status(503).json({ success: false, message: 'Use Payload CMS on Vercel.' });
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Post deleted.' });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🎯  ================================================');
  console.log('🎯  AGSR Sonipat — Website Server Running!');
  console.log(`🎯  Website:  http://localhost:${PORT}`);
  console.log(`🎯  Admin:    http://localhost:${PORT}/admin`);
  console.log(`🎯  Password: ${ADMIN_PASS}`);
  console.log('🎯  ================================================');
  console.log('');
});
