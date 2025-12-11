#!/usr/bin/env python3
"""
Setup Validation Script
Checks if all dependencies and requirements are met for the QA Tester
"""

import sys
import os
import subprocess
from pathlib import Path


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def print_check(name, passed, message=""):
    """Print check result"""
    icon = "✓" if passed else "✗"
    status = "PASS" if passed else "FAIL"
    color = "\033[92m" if passed else "\033[91m"
    reset = "\033[0m"
    
    print(f"{color}{icon} {name}: {status}{reset}")
    if message:
        print(f"  {message}")


def check_python_version():
    """Check if Python version is adequate"""
    version = sys.version_info
    required = (3, 9)
    
    is_ok = version >= required
    version_str = f"{version.major}.{version.minor}.{version.micro}"
    message = f"Version {version_str} (Required: 3.9+)"
    
    return is_ok, message


def check_pip():
    """Check if pip is available"""
    try:
        result = subprocess.run(
            ['pip', '--version'],
            capture_output=True,
            text=True
        )
        return result.returncode == 0, result.stdout.strip()
    except FileNotFoundError:
        return False, "pip not found in PATH"


def check_package(package_name):
    """Check if a Python package is installed"""
    try:
        __import__(package_name.replace('-', '_'))
        return True, f"{package_name} is installed"
    except ImportError:
        return False, f"{package_name} not found"


def check_playwright_browsers():
    """Check if Playwright browsers are installed"""
    try:
        result = subprocess.run(
            ['playwright', '--version'],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            return False, "Playwright CLI not found"
        
        # Check if chromium is installed
        home = Path.home()
        playwright_dir = home / '.cache' / 'ms-playwright'
        
        if playwright_dir.exists():
            chromium_dirs = list(playwright_dir.glob('chromium-*'))
            if chromium_dirs:
                return True, f"Chromium browser installed"
            else:
                return False, "Chromium browser not installed (run: playwright install chromium)"
        else:
            return False, "Playwright browsers not installed (run: playwright install chromium)"
            
    except FileNotFoundError:
        return False, "Playwright not installed"


def check_directory_structure():
    """Check if required directories exist"""
    current_dir = Path.cwd()
    
    required_files = [
        'app.py',
        'qa_automation.py',
        'test_history.py',
        'requirements.txt'
    ]
    
    missing = []
    for file in required_files:
        if not (current_dir / file).exists():
            missing.append(file)
    
    if missing:
        return False, f"Missing files: {', '.join(missing)}"
    return True, "All required files present"


def check_env_variable():
    """Check if GEMINI_API_KEY is set"""
    api_key = os.environ.get('GEMINI_API_KEY')
    
    if api_key:
        # Mask the key for security
        masked = api_key[:10] + "..." + api_key[-4:] if len(api_key) > 14 else "***"
        return True, f"API key set ({masked})"
    else:
        return False, "GEMINI_API_KEY not set (will use default from code)"


def check_port_available():
    """Check if port 5000 is available"""
    import socket
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 5000))
    sock.close()
    
    if result == 0:
        return False, "Port 5000 is already in use"
    return True, "Port 5000 is available"


def main():
    """Run all checks"""
    print_header("QA Tester Setup Validation")
    
    checks = []
    
    # Python version
    passed, msg = check_python_version()
    print_check("Python Version", passed, msg)
    checks.append(passed)
    
    # pip
    passed, msg = check_pip()
    print_check("pip Package Manager", passed, msg)
    checks.append(passed)
    
    # Required packages
    required_packages = [
        ('flask', 'Flask'),
        ('flask_cors', 'flask-cors'),
        ('playwright', 'playwright'),
        ('selenium', 'selenium'),
        ('google.generativeai', 'google-generativeai')
    ]
    
    print("\nRequired Python Packages:")
    for import_name, package_name in required_packages:
        passed, msg = check_package(import_name)
        print_check(f"  {package_name}", passed, msg)
        checks.append(passed)
    
    # Playwright browsers
    print("\nBrowser Automation:")
    passed, msg = check_playwright_browsers()
    print_check("Playwright Browsers", passed, msg)
    checks.append(passed)
    
    # Directory structure
    print("\nProject Structure:")
    passed, msg = check_directory_structure()
    print_check("Required Files", passed, msg)
    checks.append(passed)
    
    # Environment
    print("\nEnvironment:")
    passed, msg = check_env_variable()
    print_check("API Key", passed, msg)
    # Don't add to checks as it's optional
    
    passed, msg = check_port_available()
    print_check("Port 5000", passed, msg)
    checks.append(passed)
    
    # Summary
    print_header("Summary")
    
    total = len(checks)
    passed_count = sum(checks)
    failed_count = total - passed_count
    
    print(f"Total Checks: {total}")
    print(f"Passed: {passed_count}")
    print(f"Failed: {failed_count}")
    
    if failed_count == 0:
        print("\n✓ All checks passed! You're ready to run the QA Tester.")
        print("\nTo start the backend, run:")
        print("  python app.py")
        print("\nOr use the startup script:")
        print("  ./start.sh")
        return 0
    else:
        print("\n✗ Some checks failed. Please fix the issues above.")
        print("\nTo install missing packages:")
        print("  pip install -r requirements.txt")
        print("\nTo install Playwright browsers:")
        print("  playwright install chromium")
        return 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\nSetup check interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nUnexpected error: {str(e)}")
        sys.exit(1)
