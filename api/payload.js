// ============================================================
//  AGSR Sonipat — Payload CMS Serverless Handler (Vercel)
// ============================================================
const express  = require('express')
const payload  = require('payload')
const path     = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Explicitly require config so Vercel's bundler includes it (and all collections)
const payloadConfig = require('../payload.config')

// Cache between warm invocations
let cachedApp = null

const initPayload = async () => {
  if (cachedApp) return cachedApp

  const app = express()

  await payload.init({
    config:   payloadConfig,
    secret:   process.env.PAYLOAD_SECRET || 'agsr-payload-secret-2024',
    mongoURL: process.env.MONGODB_URI,
    express:  app,
    onInit:   () => {
      console.log('✅ Payload CMS initialised')
    },
  })

  // ── Backward-compatible blog API ──────────────────────────
  app.get('/api/blog', async (req, res) => {
    try {
      const { category, limit = 20, offset = 0 } = req.query
      const page = Math.floor(Number(offset) / Number(limit)) + 1

      const where = { status: { equals: 'published' } }
      if (category && category !== 'all') {
        where.category = { equals: category }
      }

      const result = await payload.find({
        collection: 'blog-posts',
        where,
        limit: Number(limit),
        page,
        sort: '-createdAt',
      })

      const data = result.docs.map(p => ({
        id:          p.id,
        title:       p.title,
        slug:        p.slug,
        excerpt:     p.excerpt     || '',
        cover_image: p.coverImage?.url || '',
        category:    p.category    || 'general',
        tags:        p.tags        || '',
        author:      p.author      || 'AGSR Team',
        created_at:  p.createdAt,
      }))

      res.json({ success: true, data, total: result.totalDocs })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const result = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [
            { slug:   { equals: req.params.slug } },
            { status: { equals: 'published'    } },
          ],
        },
        limit: 1,
      })

      if (!result.docs.length) {
        return res.status(404).json({ success: false, message: 'Post not found.' })
      }

      const p = result.docs[0]
      res.json({
        success: true,
        data: {
          ...p,
          cover_image: p.coverImage?.url || '',
          created_at:  p.createdAt,
          featured:    false,
        },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: err.message })
    }
  })

  // ── Enquiry submission ────────────────────────────────────
  app.post('/api/enquiry', async (req, res) => {
    try {
      const { name, phone, age_group, discipline, message, email } = req.body

      if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Name and phone are required.' })
      }

      const doc = await payload.create({
        collection: 'enquiries',
        data: {
          name,
          phone,
          email:      email      || '',
          ageGroup:   age_group  || '',
          discipline: discipline || '',
          message:    message    || '',
          status:     'new',
        },
      })

      console.log(`New enquiry from ${name} — ID: ${doc.id}`)
      res.json({ success: true, message: '🎯 Enquiry received! We will contact you soon.', id: doc.id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, message: 'Server error. Please try again.' })
    }
  })

  cachedApp = app
  return app
}

// Vercel serverless export
module.exports = async (req, res) => {
  try {
    const app = await initPayload()
    app(req, res)
  } catch (err) {
    console.error('Payload boot error:', err)
    res.status(500).json({ error: 'CMS initialisation error', detail: err.message })
  }
}
