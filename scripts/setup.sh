#!/bin/bash

# Setup script for Коди AI Assistant

echo "🚀 Setting up Коди AI Assistant..."
echo ""

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  WARNING: GEMINI_API_KEY environment variable is not set!"
    echo ""
    echo "📝 To get your API key:"
    echo "   1. Visit: https://aistudio.google.com/app/apikey"
    echo "   2. Create or sign in to your Google account"
    echo "   3. Click 'Create API Key'"
    echo "   4. Copy the key"
    echo ""
    echo "💡 To set it up, run:"
    echo "   export GEMINI_API_KEY='your_api_key_here'"
    echo ""
    echo "   Or add it to functions/.env file:"
    echo "   echo 'GEMINI_API_KEY=your_api_key_here' > functions/.env"
    echo ""
else
    echo "✅ GEMINI_API_KEY is set"
    # Update the .env file
    echo "GEMINI_API_KEY=$GEMINI_API_KEY" > functions/.env
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd functions && npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client && npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To run the app:"
echo "   1. Start Firebase emulators: npm run start:backend"
echo "   2. In another terminal, start React app: npm run start:frontend"
echo ""
