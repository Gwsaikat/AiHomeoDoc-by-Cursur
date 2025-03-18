// Custom build script for Netlify
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom Netlify build process...');

// Ensure TailwindCSS is installed directly
try {
  console.log('📦 Installing TailwindCSS and dependencies...');
  // Create minimal tailwind.config.js if it doesn't exist
  if (!fs.existsSync('./tailwind.config.js')) {
    console.log('Creating minimal tailwind.config.js...');
    fs.writeFileSync('./tailwind.config.js', `
      module.exports = {
        content: ['./src/**/*.{js,ts,jsx,tsx}'],
        theme: { extend: {} },
        plugins: [],
      }
    `);
  }

  // Create minimal postcss.config.js if it doesn't exist
  if (!fs.existsSync('./postcss.config.js')) {
    console.log('Creating minimal postcss.config.js...');
    fs.writeFileSync('./postcss.config.js', `
      module.exports = {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      }
    `);
  }

  // Force install TailwindCSS globally and locally
  execSync('npm install -g tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  execSync('npm install --no-save tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.18', { stdio: 'inherit' });
  
  // Verify installation
  console.log('✅ TailwindCSS installation successful');
  
  // Run the build
  console.log('🏗️ Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 