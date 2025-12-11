#!/bin/bash

# Startup script for QA Tester Backend
# This script sets up the environment and starts the Flask application

set -e  # Exit on error

echo "==================================="
echo "  QA Tester Backend Startup"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "app.py" ]; then
    echo -e "${RED}Error: app.py not found. Please run this script from the backend directory.${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p screenshots history test_results

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo -e "${GREEN}Python version: $PYTHON_VERSION${NC}"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/upgrade dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Install Playwright browsers
echo -e "${YELLOW}Checking Playwright browsers...${NC}"
if ! playwright --version &> /dev/null; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    playwright install chromium
else
    echo -e "${GREEN}Playwright is already installed${NC}"
fi

# Check for environment variables
if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${YELLOW}Warning: GEMINI_API_KEY environment variable not set${NC}"
    echo -e "${YELLOW}The application will use the default API key from code${NC}"
else
    echo -e "${GREEN}GEMINI_API_KEY is set${NC}"
fi

# Check if port 5000 is available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Error: Port 5000 is already in use${NC}"
    echo -e "${YELLOW}Please stop the process using port 5000 or change the port in app.py${NC}"
    exit 1
fi

# Start the application
echo -e "${GREEN}==================================="
echo -e "Starting Flask application..."
echo -e "===================================${NC}"
echo ""
echo -e "${GREEN}Backend will be available at: http://localhost:5000${NC}"
echo -e "${GREEN}Health check: http://localhost:5000/api/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start Flask
python3 app.py
