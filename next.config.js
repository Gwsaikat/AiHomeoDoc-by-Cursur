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
}

module.exports = nextConfig 