#!/bin/bash

# Render build script for frontend
echo "🔧 Building frontend for Render..."

cd client

# Install dependencies
npm install

# Build the React app
npm run build

echo "✅ Frontend build complete"
echo "📦 Build output in client/build/"
