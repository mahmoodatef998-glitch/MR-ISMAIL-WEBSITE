import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },

  // Three.js / R3F need these to build correctly on Vercel
  transpilePackages: ['three'],

  webpack(config, { isServer }) {
    // Prevent canvas / WebGL modules from being bundled on the server
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals ?? {}]),
        'canvas',
        'gl',
      ]
    }

    // Suppress "Critical dependency" warnings from postprocessing
    config.module = config.module ?? {}
    config.module.exprContextCritical = false

    return config
  },
}

export default nextConfig
