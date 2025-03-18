#!/bin/bash

# Script to deploy AI Homeopathy to Netlify

echo "🚀 Preparing to deploy AI Homeopathy to Netlify..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for Netlify CLI
if ! command -v netlify &> /dev/null
then
    echo "🔧 Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
else
    echo "✅ Netlify CLI already installed!"
fi

# Optimizing the build
echo "🔧 Optimizing for production..."
npm run build

# Login to Netlify (if needed)
echo "🔑 Authenticating with Netlify..."
echo "If you're not logged in, you'll be prompted to authorize Netlify CLI"
netlify status || netlify login

# Deploy the app
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✨ Deployment complete! Check the URL above to access your site."
echo "ℹ️ Remember to set up your environment variables in the Netlify dashboard."
echo "📖 For more information, refer to the NETLIFY_DEPLOYMENT.md file." 