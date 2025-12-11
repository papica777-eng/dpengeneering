#!/bin/bash

# ============================================
# API Key Setup Helper
# ============================================
# This script helps you configure your Gemini API key
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         GEMINI API KEY SETUP                             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}\n"

# Check if API key is already set
if [ ! -z "$GEMINI_API_KEY" ]; then
    echo -e "${GREEN}✅ API key is already configured!${NC}"
    echo -e "   Current key: ${GEMINI_API_KEY:0:10}...${GEMINI_API_KEY: -4}"
    echo ""
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}Keeping existing API key. You're ready to start!${NC}"
        echo -e "\nRun: ${BLUE}./START.sh${NC} to start the application"
        exit 0
    fi
fi

echo -e "${YELLOW}You need a Gemini API key to run the QA Tester.${NC}\n"

echo "Options:"
echo "  1. I already have an API key"
echo "  2. I need to get an API key"
echo "  3. Exit"
echo ""

read -p "Choose option (1-3): " option

case $option in
    1)
        echo ""
        echo -e "${BLUE}Please enter your Gemini API key:${NC}"
        read -s api_key
        echo ""
        
        if [ -z "$api_key" ]; then
            echo -e "${RED}No API key provided. Exiting.${NC}"
            exit 1
        fi
        
        # Validate format (basic check)
        if [[ ! $api_key =~ ^AIza ]]; then
            echo -e "${YELLOW}Warning: API key doesn't start with 'AIza' (expected format)${NC}"
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        fi
        
        # Create .env file in backend
        echo "GEMINI_API_KEY=$api_key" > backend/.env
        echo "FLASK_ENV=development" >> backend/.env
        
        # Also export for current session
        export GEMINI_API_KEY="$api_key"
        
        echo -e "${GREEN}✅ API key configured successfully!${NC}"
        echo ""
        echo "Your API key has been saved to: backend/.env"
        echo "(This file is in .gitignore and won't be committed)"
        echo ""
        echo -e "${GREEN}You're ready to start!${NC}"
        echo -e "\nRun: ${BLUE}./START.sh${NC} to start the application"
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}Getting an API key:${NC}"
        echo ""
        echo "1. Visit: ${GREEN}https://makersuite.google.com/app/apikey${NC}"
        echo "2. Sign in with your Google account"
        echo "3. Click 'Create API Key'"
        echo "4. Copy the key"
        echo "5. Run this script again and choose option 1"
        echo ""
        echo -e "${YELLOW}Opening browser...${NC}"
        
        # Try to open browser
        if command -v xdg-open &> /dev/null; then
            xdg-open "https://makersuite.google.com/app/apikey"
        elif command -v open &> /dev/null; then
            open "https://makersuite.google.com/app/apikey"
        else
            echo "Please visit the URL manually"
        fi
        ;;
        
    3)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac
