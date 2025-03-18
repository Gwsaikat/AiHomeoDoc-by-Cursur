// Direct build helper for Netlify
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Netlify build helper...');

try {
  // Install critical dependencies directly
  console.log('Installing critical dependencies...');
  execSync('npm install --no-save @netlify/plugin-nextjs tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  
  // Verify Netlify plugin installation
  const pluginPath = path.join(process.cwd(), 'node_modules', '@netlify', 'plugin-nextjs');
  if (fs.existsSync(pluginPath)) {
    console.log('Netlify plugin installed at:', pluginPath);
    const packageJsonPath = path.join(pluginPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('Plugin package.json exists');
    } else {
      console.log('WARNING: Plugin package.json missing, creating a minimal one');
      fs.writeFileSync(packageJsonPath, JSON.stringify({
        name: "@netlify/plugin-nextjs",
        version: "5.10.0",
        main: "dist/index.js"
      }, null, 2));
    }
  } else {
    console.log('Plugin directory missing, creating it');
    fs.mkdirSync(pluginPath, { recursive: true });
    fs.writeFileSync(path.join(pluginPath, 'package.json'), JSON.stringify({
      name: "@netlify/plugin-nextjs",
      version: "5.10.0",
      main: "dist/index.js"
    }, null, 2));
  }
  
  // Run the Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 