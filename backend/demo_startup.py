#!/usr/bin/env python3
"""
Quick Demo Startup Script
Demonstrates the QA Tester application is ready to run
"""

import os
import sys
import subprocess
import time

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def print_step(number, text):
    """Print step"""
    print(f"📍 Step {number}: {text}")

def print_success(text):
    """Print success message"""
    print(f"✅ {text}")

def print_info(text):
    """Print info message"""
    print(f"ℹ️  {text}")

def check_dependencies():
    """Check if dependencies are installed"""
    print_step(1, "Checking Python dependencies...")
    
    try:
        import flask
        print_success("Flask is installed")
    except ImportError:
        print("❌ Flask not installed")
        print("   Run: pip install -r requirements.txt")
        return False
    
    try:
        import playwright
        print_success("Playwright is installed")
    except ImportError:
        print("❌ Playwright not installed")
        print("   Run: pip install playwright")
        return False
    
    try:
        import selenium
        print_success("Selenium is installed")
    except ImportError:
        print("❌ Selenium not installed")
        print("   Run: pip install selenium")
        return False
    
    try:
        import google.generativeai as genai
        print_success("Google Generative AI is installed")
    except ImportError:
        print("❌ Google Generative AI not installed")
        print("   Run: pip install google-generativeai")
        return False
    
    return True

def check_api_key():
    """Check if API key is set"""
    print_step(2, "Checking API key...")
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if api_key:
        masked = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
        print_success(f"API key is set: {masked}")
        return True
    else:
        print("⚠️  GEMINI_API_KEY not set")
        print("   The app requires this to run")
        print("   Get key from: https://makersuite.google.com/app/apikey")
        print("   Then run: export GEMINI_API_KEY='your-key-here'")
        return False

def check_files():
    """Check if required files exist"""
    print_step(3, "Checking required files...")
    
    required = ['app.py', 'qa_automation.py', 'requirements.txt']
    all_exist = True
    
    for file in required:
        if os.path.exists(file):
            print_success(f"{file} exists")
        else:
            print(f"❌ {file} not found")
            all_exist = False
    
    return all_exist

def show_startup_command():
    """Show how to start the application"""
    print_step(4, "How to start the application")
    
    print("\n📋 Startup Commands:\n")
    
    print("Option 1 - Use startup script:")
    print("  ./start.sh\n")
    
    print("Option 2 - Manual start:")
    print("  python app.py\n")
    
    print("Option 3 - With custom port:")
    print("  PORT=8000 python app.py\n")

def show_verify_commands():
    """Show verification commands"""
    print_step(5, "Verify it's running")
    
    print("\n🔍 Once started, verify with:\n")
    
    print("Health check:")
    print("  curl http://localhost:5000/api/health\n")
    
    print("Run test:")
    print("  python test_example.py\n")
    
    print("Open web interface:")
    print("  Open: ../public/index.html in browser\n")

def show_deployment_options():
    """Show deployment options"""
    print_step(6, "Deployment Options")
    
    print("\n☁️  Deploy to Cloud:\n")
    
    print("Render (Recommended):")
    print("  - Visit: https://render.com")
    print("  - One-click deploy")
    print("  - Free tier available")
    print("  - See: RENDER_DEPLOYMENT.md\n")
    
    print("Docker:")
    print("  docker build -t qa-tester .")
    print("  docker run -p 5000:5000 -e GEMINI_API_KEY='key' qa-tester\n")

def main():
    """Main demo function"""
    print_header("QA TESTER - STARTUP DEMO")
    
    print("This script demonstrates the application is ready to start.\n")
    
    # Check dependencies
    deps_ok = True
    try:
        deps_ok = check_dependencies()
    except Exception as e:
        print(f"❌ Error checking dependencies: {e}")
        print("   Run: pip install -r requirements.txt")
        deps_ok = False
    
    # Check API key
    api_key_ok = check_api_key()
    
    # Check files
    files_ok = check_files()
    
    # Show startup commands
    show_startup_command()
    
    # Show verification
    show_verify_commands()
    
    # Show deployment
    show_deployment_options()
    
    # Summary
    print_header("SUMMARY")
    
    if deps_ok:
        print_success("Dependencies are installed")
    else:
        print("❌ Dependencies missing - run: pip install -r requirements.txt")
    
    if api_key_ok:
        print_success("API key is configured")
    else:
        print("⚠️  API key not set - required to run app")
    
    if files_ok:
        print_success("All required files present")
    else:
        print("❌ Some files are missing")
    
    print("\n" + "="*60)
    
    if deps_ok and api_key_ok and files_ok:
        print("🎉 READY TO START!")
        print("\nRun one of these commands to start:")
        print("  1. ./start.sh")
        print("  2. python app.py")
        print("\nServer will be at: http://localhost:5000")
        print("="*60)
        return 0
    else:
        print("⚠️  SETUP REQUIRED")
        print("\nFollow the steps above to complete setup:")
        if not deps_ok:
            print("  1. Install dependencies: pip install -r requirements.txt")
            print("     Then: playwright install chromium")
        if not api_key_ok:
            print("  2. Set API key: export GEMINI_API_KEY='your-key'")
            print("     Get key from: https://makersuite.google.com/app/apikey")
        print("\nThen run this script again to verify!")
        print("="*60)
        return 1

if __name__ == '__main__':
    sys.exit(main())
