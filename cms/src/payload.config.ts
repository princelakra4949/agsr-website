import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { BlogPosts } from './collections/BlogPosts'
import { Enquiries } from './collections/Enquiries'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— AGSR Admin',
      favicon: '/agsr-logo.jpg',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, BlogPosts, Media, Enquiries],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-change-me',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  cors: [
    'https://agsrsonipat.in',
    'https://www.agsrsonipat.in',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),

  csrf: [
    'https://agsrsonipat.in',
    'https://www.agsrsonipat.in',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
})
