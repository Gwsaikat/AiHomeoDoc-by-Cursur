/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds 
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  // Add the following to suppress hydration warnings and improve handling
  compiler: {
    styledComponents: true,
  },
  // Netlify specific settings
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Output for compatibility with Netlify
  output: 'standalone',
}

module.exports = nextConfig 