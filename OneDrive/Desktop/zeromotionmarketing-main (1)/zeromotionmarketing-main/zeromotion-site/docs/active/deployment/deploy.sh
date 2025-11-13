#!/bin/bash

echo "🚀 Starting ZeroMotion Deployment to Production..."

# Clean build
echo "🧹 Cleaning previous builds..."
rm -rf dist .astro .vercel/output

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build output
if [ ! -d ".vercel/output" ]; then
    echo "❌ Build failed - no output directory found"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo "🔗 Linking to Vercel project..."

    # Link to the correct project
    vercel link --yes --project zeromotion-site

    # Force redeploy
    echo "🚀 Deploying to production..."
    vercel --prod --yes

    echo "✅ Deployment completed!"
    echo "🌐 Check your site at: https://www.zeromotionmarketing.com"
else
    echo "⚠️  Vercel CLI not found. Please install it with: npm i -g vercel"
    echo "📝 Manual deployment required. Push changes to GitHub to trigger automatic deployment."
fi
