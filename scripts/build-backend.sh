#!/bin/bash

# Render build script for backend
echo "🔧 Building backend for Render..."

cd functions

# Install dependencies
npm install

# Create production config
echo "✅ Backend build complete"
