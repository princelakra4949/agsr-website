const { buildConfig } = require('payload/config')
const path = require('path')

const Users     = require('./src/collections/Users')
const BlogPosts = require('./src/collections/BlogPosts')
const Media     = require('./src/collections/Media')
const Enquiries = require('./src/collections/Enquiries')

module.exports = buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || '',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- AGSR Admin',
      favicon: '/agsr-logo.jpg',
    },
  },

  collections: [
    Users,
    BlogPosts,
    Media,
    Enquiries,
  ],

  upload: {
    limits: {
      fileSize: 5000000,
    },
  },

  graphQL: {
    disable: true,
  },

  cors: [
    'https://agsr-website.vercel.app',
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
  ].filter(Boolean),

  csrf: [
    'https://agsr-website.vercel.app',
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
  ].filter(Boolean),
})
