// Netlify specific configuration for Next.js
module.exports = {
  // Enable silent mode for more reliable builds
  silent: true,
  
  // Configure the @netlify/plugin-nextjs plugin
  nextjs: {
    // Disable default publishing, as we handle it in netlify.toml
    publish: false,
    
    // Force production build
    production: true,
    
    // Configure ISR
    experimental: {
      // These are the recommended settings for Next.js 15
      incrementalPageRegeneration: true,
      optimizeCachingForDeployment: true
    }
  }
} 