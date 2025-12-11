# QA Tester Backend

Full-stack web application QA testing system using Playwright, Selenium, and Gemini AI.

## Features

- **Playwright Integration**: Fast, reliable browser automation for modern web testing
- **Selenium WebDriver**: Cross-browser testing and form interaction
- **Gemini AI Integration**: AI-powered bug detection and test analysis
- **Multiple Test Categories**:
  - Browser Navigation & URL Validation
  - Page Element & Content Integrity
  - Performance Metrics & Load Times
  - Accessibility Conformance (WCAG)
  - Form Interaction & Data Submission
  - Screenshot & Visual Regression

## Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Playwright Browsers

```bash
playwright install chromium
```

### 3. Setup Gemini API Key

Set the environment variable with your own Gemini API key:

```bash
export GEMINI_API_KEY='your-gemini-api-key-here'
```

Get your API key from: https://makersuite.google.com/app/apikey

### 4. Run the Backend

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/qa_project

Create and execute a new QA automation project.

**Request Body:**
```json
{
  "project_name": "Test Project",
  "target_url": "https://example.com",
  "selected_goals": {
    "Browser Navigation & URL Validation": true,
    "Page Element & Content Integrity": true,
    "Performance Metrics & Load Times": true,
    "Accessibility Conformance (WCAG)": true,
    "Form Interaction & Data Submission": true,
    "Screenshot & Visual Regression": true
  },
  "selenium_options": {
    "headless": true,
    "windowSize": "1920,1080"
  }
}
```

**Response:**
```json
{
  "success": true,
  "project_name": "Test Project",
  "report": {
    "report_summary": {
      "Browser Navigation & URL Validation": "Navigation successful...",
      "Page Element & Content Integrity": "All elements present..."
    },
    "recommendations": [
      "Consider improving page load time",
      "Add alt text to images"
    ],
    "critical_issues": []
  },
  "results": {
    "status": "Completed",
    "tests": [...],
    "screenshots": [...]
  }
}
```

### GET /api/qa_history

Retrieve history of all QA projects.

**Response:**
```json
[
  {
    "project_name": "Test Project",
    "target_url": "https://example.com",
    "selected_goals": {...},
    "qa_status": "Completed",
    "timestamp": "2023-12-11T00:00:00",
    "report_summary": {...},
    "recommendations": [...]
  }
]
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "QA Tester Backend is running",
  "timestamp": "2023-12-11T00:00:00"
}
```

## Architecture

### qa_automation.py
Main automation engine that:
- Executes Playwright tests for modern web testing
- Runs Selenium tests for form interactions
- Captures screenshots for visual regression
- Performs accessibility checks
- Measures performance metrics
- Uses Gemini AI for intelligent bug detection

### test_history.py
Manages persistent storage of test results:
- Stores test history in JSON format
- Retrieves past test results
- Maintains up to 100 recent projects

### app.py
Flask application that:
- Provides REST API endpoints
- Integrates with Gemini AI for report generation
- Coordinates test execution
- Returns structured results

## Testing Strategy

The system performs comprehensive testing across multiple dimensions:

1. **Functional Testing**: Navigation, element presence, form functionality
2. **Performance Testing**: Load times, resource efficiency
3. **Accessibility Testing**: WCAG compliance, ARIA labels, alt text
4. **Visual Testing**: Screenshot capture for regression analysis
5. **AI-Powered Analysis**: Gemini AI analyzes results for hidden issues

## Security Notes

- API keys should be stored as environment variables in production
- CORS is enabled for development; configure appropriately for production
- Test results may contain sensitive information; secure accordingly

## Deployment

For deployment to dpengeneering.site:

1. Update CORS settings in `app.py`
2. Configure environment variables
3. Set up reverse proxy (nginx/Apache)
4. Enable HTTPS
5. Configure domain DNS

## Troubleshooting

### Playwright Issues
```bash
# Reinstall browsers
playwright install --force chromium
```

### Selenium Issues
```bash
# Update ChromeDriver
pip install --upgrade webdriver-manager
```

### Permission Issues
```bash
# Create necessary directories
mkdir -p screenshots test_results history
chmod 755 screenshots test_results history
```

## License

Private - dpengineering project
