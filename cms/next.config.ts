import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp', 'mongoose', '@payloadcms/db-mongodb'],
}

export default withPayload(nextConfig)
