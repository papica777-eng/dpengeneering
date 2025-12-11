#!/bin/bash

# Comprehensive health check for Коди AI Bot

echo "╔════════════════════════════════════════════╗"
echo "║   🤖 Коди AI Bot - Health Check           ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check Node version
echo "📦 Node.js version:"
node --version
echo ""

# Check if backend is running
echo "🔍 Checking Backend (Port 5001)..."
if lsof -i :5001 > /dev/null 2>&1; then
    echo "  ✅ Backend is running on port 5001"
    
    # Test backend API
    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5001/kodi-bot-7/us-central1/systemHealth 2>/dev/null)
    if [ "$BACKEND_STATUS" = "200" ]; then
        echo "  ✅ Backend API responding (HTTP $BACKEND_STATUS)"
    else
        echo "  ⚠️  Backend API returned HTTP $BACKEND_STATUS"
    fi
else
    echo "  ❌ Backend is NOT running"
    echo "     Start with: cd functions && firebase emulators:start --only functions"
fi
echo ""

# Check if frontend is running
echo "🔍 Checking Frontend (Port 3000)..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "  ✅ Frontend is running on port 3000"
    
    # Test if frontend is accessible
    if curl -s http://localhost:3000 | grep -q "React App" 2>/dev/null; then
        echo "  ✅ Frontend is accessible"
    else
        echo "  ⚠️  Frontend may not be fully loaded"
    fi
else
    echo "  ❌ Frontend is NOT running"
    echo "     Start with: cd client && npm start"
fi
echo ""

# Check API key
echo "🔑 Checking API Key..."
if [ -f "functions/.env" ]; then
    if grep -q "AIzaSy" functions/.env 2>/dev/null; then
        echo "  ✅ API key configured in functions/.env"
    else
        echo "  ⚠️  API key might not be set in functions/.env"
    fi
else
    echo "  ⚠️  functions/.env file not found"
fi
echo ""

# Check Git status
echo "📂 Git Repository Status:"
if git status > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current)
    UNCOMMITTED=$(git status --porcelain | wc -l)
    echo "  Branch: $BRANCH"
    echo "  Uncommitted changes: $UNCOMMITTED files"
else
    echo "  ⚠️  Not a git repository"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════╗"
echo "║   📊 SUMMARY                               ║"
echo "╚════════════════════════════════════════════╝"

BACKEND_RUNNING=$(lsof -i :5001 > /dev/null 2>&1 && echo "YES" || echo "NO")
FRONTEND_RUNNING=$(lsof -i :3000 > /dev/null 2>&1 && echo "YES" || echo "NO")

if [ "$BACKEND_RUNNING" = "YES" ] && [ "$FRONTEND_RUNNING" = "YES" ]; then
    echo "  🎉 All systems operational!"
    echo ""
    echo "  🌐 Access your app:"
    echo "     Frontend: http://localhost:3000"
    echo "     Backend:  http://localhost:5001"
    echo "     Emulator: http://localhost:4000"
    echo ""
    echo "  💡 In Codespaces: Use PORTS tab to access"
elif [ "$BACKEND_RUNNING" = "YES" ] && [ "$FRONTEND_RUNNING" = "NO" ]; then
    echo "  ⚠️  Backend running, but frontend is down"
    echo "     Run: cd client && npm start"
elif [ "$BACKEND_RUNNING" = "NO" ] && [ "$FRONTEND_RUNNING" = "YES" ]; then
    echo "  ⚠️  Frontend running, but backend is down"
    echo "     Run: cd functions && firebase emulators:start --only functions"
else
    echo "  ❌ Neither service is running"
    echo ""
    echo "  🚀 Start both services:"
    echo "     Terminal 1: cd functions && firebase emulators:start --only functions"
    echo "     Terminal 2: cd client && npm start"
fi

echo ""
