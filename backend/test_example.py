#!/usr/bin/env python3
"""
Example Test Script for QA Automation
Demonstrates how to use the QA automation system programmatically
"""

import json
import requests
from datetime import datetime


def run_qa_test(project_name, target_url, goals, backend_url='http://localhost:5000/api'):
    """
    Run a QA test programmatically
    
    Args:
        project_name: Name of the test project
        target_url: URL to test
        goals: Dictionary of test goals
        backend_url: Backend API URL
    
    Returns:
        dict: Test results
    """
    
    print(f"\n{'='*60}")
    print(f"Starting QA Test: {project_name}")
    print(f"Target URL: {target_url}")
    print(f"{'='*60}\n")
    
    # Prepare request
    payload = {
        'project_name': project_name,
        'target_url': target_url,
        'selected_goals': goals,
        'selenium_options': {
            'headless': True,
            'windowSize': '1920,1080'
        }
    }
    
    # Send request
    try:
        print("Sending request to backend...")
        response = requests.post(
            f"{backend_url}/qa_project",
            json=payload,
            timeout=300  # 5 minute timeout
        )
        
        response.raise_for_status()
        result = response.json()
        
        print("\n" + "="*60)
        print("TEST COMPLETED SUCCESSFULLY")
        print("="*60 + "\n")
        
        # Print summary
        if 'report' in result and 'report_summary' in result['report']:
            print("SUMMARY:")
            print("-" * 60)
            for goal, summary in result['report']['report_summary'].items():
                print(f"\n{goal}:")
                print(f"  {summary}")
        
        # Print recommendations
        if 'report' in result and 'recommendations' in result['report']:
            print("\nRECOMMENDATIONS:")
            print("-" * 60)
            for i, rec in enumerate(result['report']['recommendations'], 1):
                print(f"{i}. {rec}")
        
        # Print test details
        if 'results' in result and 'tests' in result['results']:
            print("\nDETAILED TEST RESULTS:")
            print("-" * 60)
            for test in result['results']['tests']:
                status_icon = "✓" if test.get('status') == 'Passed' else "✗"
                print(f"\n{status_icon} {test.get('goal', 'Unknown')}")
                print(f"   Status: {test.get('status', 'Unknown')}")
                if 'details' in test:
                    for key, value in test['details'].items():
                        print(f"   {key}: {value}")
                if 'error' in test:
                    print(f"   Error: {test['error']}")
        
        return result
        
    except requests.exceptions.Timeout:
        print("\n❌ Error: Request timed out. Test may be taking too long.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Error: {str(e)}")
        return None
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        return None


def get_test_history(backend_url='http://localhost:5000/api'):
    """
    Retrieve test history from backend
    
    Args:
        backend_url: Backend API URL
    
    Returns:
        list: Test history
    """
    try:
        response = requests.get(f"{backend_url}/qa_history")
        response.raise_for_status()
        history = response.json()
        
        print("\n" + "="*60)
        print("TEST HISTORY")
        print("="*60 + "\n")
        
        if not history:
            print("No test history found.")
            return []
        
        for i, project in enumerate(history[:10], 1):  # Show last 10
            print(f"{i}. {project.get('project_name', 'Unknown')}")
            print(f"   URL: {project.get('target_url', 'Unknown')}")
            print(f"   Status: {project.get('qa_status', 'Unknown')}")
            print(f"   Date: {project.get('timestamp', 'Unknown')}")
            print()
        
        return history
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error retrieving history: {str(e)}")
        return []


def check_backend_health(backend_url='http://localhost:5000/api'):
    """
    Check if backend is running
    
    Args:
        backend_url: Backend API URL
    
    Returns:
        bool: True if backend is healthy
    """
    try:
        response = requests.get(f"{backend_url}/health", timeout=5)
        response.raise_for_status()
        health = response.json()
        
        print("\n" + "="*60)
        print("BACKEND HEALTH CHECK")
        print("="*60 + "\n")
        print(f"Status: {health.get('status', 'Unknown')}")
        print(f"Message: {health.get('message', 'Unknown')}")
        print(f"Timestamp: {health.get('timestamp', 'Unknown')}")
        
        return health.get('status') == 'OK'
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend is not responding: {str(e)}")
        print("\nPlease ensure the backend is running:")
        print("  cd backend")
        print("  python app.py")
        return False


# Example test configurations

# Basic test
BASIC_TEST = {
    'Browser Navigation & URL Validation': True,
    'Page Element & Content Integrity': True
}

# Full comprehensive test
COMPREHENSIVE_TEST = {
    'Browser Navigation & URL Validation': True,
    'Page Element & Content Integrity': True,
    'Performance Metrics & Load Times': True,
    'Accessibility Conformance (WCAG)': True,
    'Form Interaction & Data Submission': True,
    'Screenshot & Visual Regression': True
}

# Performance-focused test
PERFORMANCE_TEST = {
    'Performance Metrics & Load Times': True,
    'Browser Navigation & URL Validation': True
}

# Accessibility-focused test
ACCESSIBILITY_TEST = {
    'Accessibility Conformance (WCAG)': True,
    'Page Element & Content Integrity': True
}


if __name__ == '__main__':
    import sys
    
    # Check if backend is running
    if not check_backend_health():
        print("\n⚠️  Please start the backend first and try again.")
        sys.exit(1)
    
    # Example 1: Test dpengeneering.site
    print("\n" + "="*60)
    print("Example 1: Testing dpengeneering.site")
    print("="*60)
    
    result1 = run_qa_test(
        project_name="dpengineering.site Homepage Test",
        target_url="https://dpengineering.site",
        goals=BASIC_TEST
    )
    
    # Example 2: Test Google (for demonstration)
    print("\n" + "="*60)
    print("Example 2: Testing Google.com")
    print("="*60)
    
    result2 = run_qa_test(
        project_name="Google Search Test",
        target_url="https://www.google.com",
        goals=PERFORMANCE_TEST
    )
    
    # Show history
    history = get_test_history()
    
    print("\n" + "="*60)
    print("ALL EXAMPLES COMPLETED")
    print("="*60)
    print("\nYou can now:")
    print("1. View results in the web interface")
    print("2. Check the history endpoint")
    print("3. Review generated screenshots in backend/screenshots/")
    print()
