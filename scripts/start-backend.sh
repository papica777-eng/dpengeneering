#!/bin/bash

# Start script for development

# Check if API key is set
if [ -z "$GEMINI_API_KEY" ]; then
    if [ -f "functions/.env" ]; then
        export $(cat functions/.env | xargs)
    fi
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_api_key_here" ]; then
    echo "⚠️  ERROR: GEMINI_API_KEY is not set or is using default value!"
    echo ""
    echo "📝 Please get your API key from: https://aistudio.google.com/app/apikey"
    echo ""
    echo "Then set it by running:"
    echo "   export GEMINI_API_KEY='your_actual_api_key'"
    echo ""
    echo "Or edit functions/.env and replace 'your_api_key_here' with your actual key"
    exit 1
fi

echo "✅ API key configured"
echo "🚀 Starting Firebase Emulators..."
echo ""
echo "📝 Note: Keep this terminal running. Open another terminal to start the React app."
echo ""

cd functions && firebase emulators:start --only functions
