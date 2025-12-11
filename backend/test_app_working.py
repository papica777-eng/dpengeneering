#!/usr/bin/env python3
"""
Application Validation Test
Tests that the QA Tester application is properly configured and working
"""

import os
import sys
import json

def print_test(name, status, details=""):
    """Print test result"""
    icon = "✅" if status else "❌"
    status_text = "PASS" if status else "FAIL"
    print(f"{icon} {name}: {status_text}")
    if details:
        print(f"   {details}")

def test_api_key_security():
    """Test 1: API key security"""
    print("\n" + "="*60)
    print("TEST 1: API Key Security")
    print("="*60)
    
    # Check app.py
    with open('app.py', 'r') as f:
        app_content = f.read()
    
    # Should not have hardcoded API key
    test1 = 'AIzaSyD' not in app_content
    print_test("No hardcoded API key in app.py", test1)
    
    # Should require environment variable
    test2 = "os.environ.get('GEMINI_API_KEY')" in app_content
    print_test("Gets API key from environment", test2)
    
    # Should raise error if missing
    test3 = "raise ValueError" in app_content and "GEMINI_API_KEY" in app_content
    print_test("Raises error when key missing", test3)
    
    return test1 and test2 and test3

def test_documentation():
    """Test 2: Documentation doesn't expose API key"""
    print("\n" + "="*60)
    print("TEST 2: Documentation Security")
    print("="*60)
    
    docs_to_check = [
        'README.md',
        'backend/README.md',
        'QA_TESTER_README.md',
        'IMPLEMENTATION_REPORT.md',
        'RENDER_DEPLOYMENT.md',
        'QUICKSTART.md'
    ]
    
    all_clean = True
    for doc in docs_to_check:
        try:
            with open(f'../{doc}', 'r') as f:
                content = f.read()
            has_key = 'AIzaSyD' in content
            print_test(f"No API key in {doc}", not has_key)
            all_clean = all_clean and not has_key
        except FileNotFoundError:
            print_test(f"Check {doc}", False, "File not found")
            all_clean = False
    
    return all_clean

def test_required_files():
    """Test 3: Required files exist"""
    print("\n" + "="*60)
    print("TEST 3: Required Files")
    print("="*60)
    
    required_files = [
        'app.py',
        'qa_automation.py',
        'test_history.py',
        'test_cases.py',
        'requirements.txt',
        'README.md',
        'Dockerfile',
        '.dockerignore'
    ]
    
    all_exist = True
    for file in required_files:
        exists = os.path.exists(file)
        print_test(f"{file} exists", exists)
        all_exist = all_exist and exists
    
    return all_exist

def test_deployment_configs():
    """Test 4: Deployment configurations"""
    print("\n" + "="*60)
    print("TEST 4: Deployment Configurations")
    print("="*60)
    
    # Check render.yaml
    render_exists = os.path.exists('../render.yaml')
    print_test("render.yaml exists", render_exists)
    
    # Check .env.example
    env_example_exists = os.path.exists('../.env.example')
    print_test(".env.example exists", env_example_exists)
    
    # Check Dockerfile
    dockerfile_exists = os.path.exists('Dockerfile')
    print_test("Dockerfile exists", dockerfile_exists)
    
    return render_exists and env_example_exists and dockerfile_exists

def test_dependencies():
    """Test 5: Dependencies file"""
    print("\n" + "="*60)
    print("TEST 5: Dependencies")
    print("="*60)
    
    with open('requirements.txt', 'r') as f:
        deps = f.read()
    
    required_deps = [
        'Flask',
        'flask-cors',
        'playwright',
        'selenium',
        'google-generativeai'
    ]
    
    all_present = True
    for dep in required_deps:
        present = dep.lower() in deps.lower()
        print_test(f"{dep} in requirements", present)
        all_present = all_present and present
    
    return all_present

def test_python_syntax():
    """Test 6: Python files compile"""
    print("\n" + "="*60)
    print("TEST 6: Python Syntax")
    print("="*60)
    
    python_files = [
        'app.py',
        'qa_automation.py',
        'test_history.py',
        'test_cases.py',
        'check_setup.py'
    ]
    
    all_valid = True
    for file in python_files:
        try:
            with open(file, 'r') as f:
                code = f.read()
            compile(code, file, 'exec')
            print_test(f"{file} compiles", True)
        except SyntaxError as e:
            print_test(f"{file} compiles", False, str(e))
            all_valid = False
    
    return all_valid

def test_documentation_quality():
    """Test 7: Documentation quality"""
    print("\n" + "="*60)
    print("TEST 7: Documentation Quality")
    print("="*60)
    
    # Check README has key sections
    with open('../README.md', 'r') as f:
        readme = f.read()
    
    sections = [
        'Quick Start',
        'Deploy to Render',
        'Test Categories',
        'Usage',
        'API'
    ]
    
    all_present = True
    for section in sections:
        present = section in readme
        print_test(f"README has '{section}' section", present)
        all_present = all_present and present
    
    return all_present

def test_render_deployment():
    """Test 8: Render deployment config"""
    print("\n" + "="*60)
    print("TEST 8: Render Deployment Config")
    print("="*60)
    
    with open('../render.yaml', 'r') as f:
        render_config = f.read()
    
    checks = {
        'Has service type': 'type: web' in render_config,
        'Has Python env': 'env: python' in render_config,
        'Has build command': 'buildCommand' in render_config,
        'Has start command': 'startCommand' in render_config,
        'References GEMINI_API_KEY': 'GEMINI_API_KEY' in render_config,
        'Has health check': 'healthCheckPath' in render_config
    }
    
    all_valid = True
    for check, result in checks.items():
        print_test(check, result)
        all_valid = all_valid and result
    
    return all_valid

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("QA TESTER - APPLICATION VALIDATION")
    print("="*60)
    
    tests = [
        ("API Key Security", test_api_key_security),
        ("Documentation Security", test_documentation),
        ("Required Files", test_required_files),
        ("Deployment Configs", test_deployment_configs),
        ("Dependencies", test_dependencies),
        ("Python Syntax", test_python_syntax),
        ("Documentation Quality", test_documentation_quality),
        ("Render Config", test_render_deployment)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ Test '{name}' failed with error: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        icon = "✅" if result else "❌"
        print(f"{icon} {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Application is ready!")
        print("\nNext steps:")
        print("1. Set GEMINI_API_KEY environment variable")
        print("2. Deploy to Render or run locally")
        print("3. Start testing!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please fix before deploying.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
