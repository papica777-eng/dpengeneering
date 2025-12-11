#!/bin/bash

echo "========================================="
echo "  Коди AI - Render Deployment Checker"
echo "========================================="
echo ""

# Check if code is ready
echo "📋 Checking deployment readiness..."
echo ""

# Check if .gitignore exists
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore configured"
else
    echo "❌ .gitignore missing"
fi

# Check if render config exists
if [ -f "render.yaml" ]; then
    echo "✅ render.yaml configured"
else
    echo "⚠️  render.yaml missing (optional)"
fi

# Check if backend has required files
if [ -f "functions/index-render.js" ]; then
    echo "✅ Backend Render adapter exists"
else
    echo "❌ functions/index-render.js missing"
fi

# Check if frontend build works
if [ -f "client/package.json" ]; then
    echo "✅ Frontend package.json exists"
else
    echo "❌ client/package.json missing"
fi

# Check for API key
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✅ GEMINI_API_KEY environment variable set"
elif [ -f "functions/.env" ]; then
    echo "⚠️  API key should be in functions/.env"
else
    echo "❌ GEMINI_API_KEY not set"
fi

echo ""
echo "========================================="
echo "📝 Next Steps:"
echo "========================================="
echo ""
echo "1. Make sure all changes are committed:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to Render Dashboard:"
echo "   https://dashboard.render.com/"
echo ""
echo "3. Create two services:"
echo "   - Web Service (Backend) from functions/"
echo "   - Static Site (Frontend) from client/"
echo ""
echo "4. Add your domain dpengineering.site"
echo "   in the frontend service settings"
echo ""
echo "5. Update DNS records at your registrar"
echo ""
echo "📚 See RENDER_DEPLOYMENT.md for full guide"
echo "📋 Use DEPLOYMENT_CHECKLIST.md for step-by-step"
echo ""
