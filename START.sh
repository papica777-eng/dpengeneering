#!/bin/bash

# ============================================
# QA TESTER - ONE-COMMAND STARTUP
# ============================================
# This script starts the QA Tester application
# Usage: ./START.sh [--demo]
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║          QA TESTER - AUTOMATED WEB TESTING               ║"
echo "║          AI-Powered with Playwright & Selenium           ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Check if demo mode
if [ "$1" == "--demo" ]; then
    echo -e "${YELLOW}Running in DEMO mode (showing setup steps)${NC}\n"
    cd backend
    python3 demo_startup.py
    exit $?
fi

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo -e "${RED}Error: 'backend' directory not found${NC}"
    echo "Please run this script from the repository root"
    exit 1
fi

# Navigate to backend
cd backend

echo -e "${GREEN}🚀 Starting QA Tester Application...${NC}\n"

# Step 1: Check API Key
echo -e "${YELLOW}Step 1: Checking API key...${NC}"

# Try to load from .env file if not in environment
if [ -z "$GEMINI_API_KEY" ] && [ -f ".env" ]; then
    echo "Loading API key from .env file..."
    set -a
    source .env
    set +a
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}❌ GEMINI_API_KEY is not configured${NC}"
    echo ""
    echo "Quick setup: Run ${GREEN}../SETUP_API_KEY.sh${NC} for interactive setup"
    echo ""
    echo "Or manually:"
    echo "1. Get API key: ${BLUE}https://makersuite.google.com/app/apikey${NC}"
    echo "2. Set it: ${GREEN}export GEMINI_API_KEY='your-key'${NC}"
    echo "3. Run: ${GREEN}../START.sh${NC}"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ API key is configured${NC}\n"
fi

# Step 2: Check if dependencies are installed
echo -e "${YELLOW}Step 2: Checking dependencies...${NC}"
if ! python3 -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    
    # Create venv if doesn't exist
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate venv
    source venv/bin/activate
    
    # Install dependencies
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    
    # Install Playwright browsers
    echo "Installing Playwright browsers..."
    playwright install chromium
    
    echo -e "${GREEN}✅ Dependencies installed${NC}\n"
else
    echo -e "${GREEN}✅ Dependencies are ready${NC}\n"
fi

# Step 3: Check port availability
echo -e "${YELLOW}Step 3: Checking port 5000...${NC}"
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ Port 5000 is already in use${NC}"
    echo ""
    echo "Options:"
    echo "1. Stop the process using port 5000"
    echo "2. Use a different port: ${GREEN}PORT=8000 ../START.sh${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Port 5000 is available${NC}\n"
fi

# Step 4: Create directories
echo -e "${YELLOW}Step 4: Creating directories...${NC}"
mkdir -p screenshots history test_results
echo -e "${GREEN}✅ Directories created${NC}\n"

# All checks passed - start the server
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                STARTING SERVER                           ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Server Information:${NC}"
echo "  📍 Backend API: http://localhost:5000"
echo "  🏥 Health Check: http://localhost:5000/api/health"
echo "  📊 Test History: http://localhost:5000/api/qa_history"
echo ""
echo -e "${BLUE}To Use:${NC}"
echo "  1. Open: ${GREEN}public/index.html${NC} in your browser"
echo "  2. Or test via API:"
echo "     ${GREEN}curl http://localhost:5000/api/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""
echo -e "${GREEN}Starting Flask application...${NC}"
echo "================================================================"
echo ""

# Activate venv if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start the application
python3 app.py
