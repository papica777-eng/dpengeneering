#!/bin/bash

echo "🚀 Deploying Modernized Kodi AI Assistant"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this from the dpengeneering directory"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    git status --short
    echo ""
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "🚀 Modernize full-stack architecture with security improvements"
    fi
fi

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main --rebase

# Push changes
echo "📤 Pushing changes to GitHub..."
if git push origin main; then
    echo ""
    echo "✅ SUCCESS! Changes pushed to GitHub"
    echo ""
    echo "🔄 Render will now automatically deploy your changes"
    echo "⏱️  Deployment usually takes 2-5 minutes"
    echo ""
    echo "📍 Your sites:"
    echo "   Backend:  https://kodi-backend.onrender.com"
    echo "   Frontend: https://dpengeneering.site"
    echo ""
    echo "🔍 Monitor deployment at:"
    echo "   https://dashboard.render.com"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. You're logged into GitHub"
    echo "   2. You have write access to the repository"
    echo "   3. Your internet connection is working"
    echo ""
    exit 1
fi
