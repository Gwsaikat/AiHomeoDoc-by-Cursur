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
  
  // Configure experimental features properly
  experimental: {
    // Configure proper server actions setup
    serverComponentsExternalPackages: [],
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  
  // Set which pages are static and which are server-rendered
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Configure proper cache settings
  distDir: '.next',
  
  // Webpack configuration for proper module resolution
  webpack: (config) => {
    // Add TailwindCSS resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Reduce NextJS Fonts size warnings
    config.performance = {
      ...config.performance,
      hints: false,
    };
    
    return config;
  },
}

module.exports = nextConfig 