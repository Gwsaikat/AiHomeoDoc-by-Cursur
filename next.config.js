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
  
  // Updated experimental features for Next.js 15
  experimental: {
    // Removed invalid serverExternalPackages key
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
    // Handle TailwindCSS manually to avoid module resolution issues
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Add TailwindCSS to PostCSS config directly
    const postCssLoaderOptions = {
      postcssOptions: {
        plugins: [
          ['postcss-preset-env', { stage: 3 }],
          ['autoprefixer'],
          ['tailwindcss']
        ],
      },
    };
    
    // Find the PostCSS loader and update its options
    const rules = config.module.rules;
    rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.forEach(oneOfRule => {
          if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
            oneOfRule.use.forEach(loader => {
              if (loader.loader && loader.loader.includes('postcss-loader')) {
                loader.options = postCssLoaderOptions;
              }
            });
          }
        });
      }
    });
    
    // Reduce NextJS Fonts size warnings
    config.performance = {
      ...config.performance,
      hints: false,
    };
    
    return config;
  },
}

module.exports = nextConfig 