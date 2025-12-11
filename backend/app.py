"""
Flask Backend for QA Tester Application
Integrates Playwright, Selenium, and Gemini API for automated testing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import google.generativeai as genai
from qa_automation import QAAutomation
from test_history import TestHistory

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize Gemini API
# SECURITY: API key MUST be set as environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError('GEMINI_API_KEY environment variable is required. Please set it before starting the application.')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize test history manager
history_manager = TestHistory()

@app.route('/api/qa_project', methods=['POST'])
def create_qa_project():
    """
    Create and execute a new QA automation project
    Expected JSON body:
    {
        "project_name": "string",
        "target_url": "string",
        "selected_goals": {
            "Browser Navigation & URL Validation": true,
            "Page Element & Content Integrity": true,
            ...
        },
        "selenium_options": {"headless": true, "windowSize": "1920,1080"}
    }
    """
    try:
        data = request.get_json()
        
        project_name = data.get('project_name')
        target_url = data.get('target_url')
        selected_goals = data.get('selected_goals', {})
        selenium_options = data.get('selenium_options', {})
        
        # Validate input
        if not project_name or not target_url:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if not selected_goals:
            return jsonify({'error': 'No automation goals selected'}), 400
        
        # Parse selenium options if it's a string
        if isinstance(selenium_options, str):
            try:
                selenium_options = json.loads(selenium_options)
            except json.JSONDecodeError:
                selenium_options = {}
        
        # Initialize QA automation
        qa_automation = QAAutomation(
            project_name=project_name,
            target_url=target_url,
            selected_goals=selected_goals,
            selenium_options=selenium_options,
            gemini_api_key=GEMINI_API_KEY
        )
        
        # Execute automation
        results = qa_automation.execute()
        
        # Generate AI-powered report using Gemini
        report = generate_ai_report(results, selected_goals)
        
        # Save to history
        project_data = {
            'project_name': project_name,
            'target_url': target_url,
            'selected_goals': selected_goals,
            'qa_status': results.get('status', 'Completed'),
            'timestamp': datetime.now().isoformat(),
            'report_summary': report.get('report_summary', {}),
            'recommendations': report.get('recommendations', []),
            'test_results': results
        }
        
        history_manager.add_project(project_data)
        
        return jsonify({
            'success': True,
            'project_name': project_name,
            'report': report,
            'results': results
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in create_qa_project: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/qa_history', methods=['GET'])
def get_qa_history():
    """
    Get history of all QA automation projects
    """
    try:
        projects = history_manager.get_all_projects()
        return jsonify(projects), 200
    except Exception as e:
        app.logger.error(f"Error in get_qa_history: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'OK',
        'message': 'QA Tester Backend is running',
        'timestamp': datetime.now().isoformat()
    }), 200


def generate_ai_report(results, selected_goals):
    """
    Generate AI-powered analysis report using Gemini API
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Create prompt for Gemini
        prompt = f"""
        As a QA testing expert, analyze the following automated test results and provide insights:
        
        Test Goals Executed: {', '.join(selected_goals.keys())}
        
        Test Results:
        {json.dumps(results, indent=2)}
        
        Please provide:
        1. A summary of findings for each test goal
        2. Critical issues found
        3. Recommendations for improvement
        4. Overall quality assessment
        
        Format your response as JSON with keys: "report_summary" (object with goal-specific summaries), "recommendations" (array), "critical_issues" (array)
        """
        
        response = model.generate_content(prompt)
        
        # Parse AI response
        try:
            ai_report = json.loads(response.text)
        except json.JSONDecodeError:
            # If AI doesn't return valid JSON, create structured response
            ai_report = {
                'report_summary': {'General': response.text[:500]},
                'recommendations': ['Review automated test results', 'Verify all critical paths'],
                'critical_issues': []
            }
        
        return ai_report
        
    except Exception as e:
        app.logger.error(f"Error generating AI report: {str(e)}")
        return {
            'report_summary': {'General': 'Test execution completed. AI report generation failed.'},
            'recommendations': ['Manual review recommended'],
            'critical_issues': []
        }


if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('screenshots', exist_ok=True)
    os.makedirs('test_results', exist_ok=True)
    os.makedirs('history', exist_ok=True)
    
    # Run the Flask app
    # SECURITY NOTE: Debug mode should be disabled in production
    # Set FLASK_ENV=production and use a proper WSGI server like gunicorn
    debug_mode = os.environ.get('FLASK_ENV', 'development') == 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
