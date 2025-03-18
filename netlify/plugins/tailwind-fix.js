// Netlify plugin to ensure TailwindCSS is installed
module.exports = {
  onPreBuild: async ({ utils }) => {
    try {
      console.log('Installing TailwindCSS and dependencies...');
      await utils.run.command('npm install --save-dev tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.18');
      console.log('TailwindCSS installation completed successfully');
      
      // Verify installation
      await utils.run.command('npx tailwindcss --help');
      console.log('TailwindCSS is available and working');
    } catch (error) {
      console.error('Error installing TailwindCSS:', error);
      utils.build.failBuild('Failed to install TailwindCSS');
    }
  }
}; 