# QA Tester Usage Guide

## Getting Started

This guide will help you set up and use the QA Tester application to test your dpengeneering.site website.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Running Tests](#running-tests)
4. [Understanding Results](#understanding-results)
5. [Advanced Usage](#advanced-usage)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### 5-Minute Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Install Playwright browsers
playwright install chromium

# 4. Start the server
python app.py
```

Open `public/index.html` in your browser and you're ready to test!

## Installation

### Step 1: Prerequisites

Ensure you have:
- Python 3.9 or higher
- pip (Python package manager)
- Internet connection (for downloading browser drivers)

Check your Python version:
```bash
python3 --version
```

### Step 2: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This installs:
- Flask (Web framework)
- Playwright (Browser automation)
- Selenium (WebDriver)
- Google Generative AI (Gemini API)

### Step 3: Install Browser Drivers

```bash
# Install Playwright's Chromium browser
playwright install chromium

# This downloads ~100MB of browser files
```

### Step 4: Set API Key (Optional)

The application includes a default Gemini API key. For production use, set your own:

```bash
export GEMINI_API_KEY='your-api-key-here'
```

Or create a `.env` file in the backend directory:
```bash
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

## Running Tests

### Method 1: Web Interface (Recommended)

1. **Start the Backend**
   ```bash
   cd backend
   python app.py
   ```
   
   You should see:
   ```
   * Running on http://0.0.0.0:5000
   ```

2. **Open the Frontend**
   - Open `public/index.html` in your web browser
   - Or serve it with: `python -m http.server 8080` from the public directory

3. **Create a Test Project**
   - Enter a project name (e.g., "Homepage Test")
   - Enter target URL (e.g., "https://dpengeneering.site")
   - Select test goals
   - Click "PLAN & EXECUTE AUTOMATION SEQUENCE"

4. **Monitor Progress**
   - Watch the console for real-time updates
   - Wait for completion (usually 30-120 seconds)
   - Review the results and recommendations

### Method 2: API Calls

Test via command line using curl:

```bash
# Test dpengeneering.site
curl -X POST http://localhost:5000/api/qa_project \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "dpengineering.site Test",
    "target_url": "https://dpengeneering.site",
    "selected_goals": {
      "Browser Navigation & URL Validation": true,
      "Page Element & Content Integrity": true,
      "Performance Metrics & Load Times": true,
      "Accessibility Conformance (WCAG)": true,
      "Screenshot & Visual Regression": true
    },
    "selenium_options": {
      "headless": true,
      "windowSize": "1920,1080"
    }
  }'
```

### Method 3: Python Script

Use the example script:

```bash
cd backend
python test_example.py
```

This runs predefined tests and shows formatted results.

## Understanding Results

### Test Output Structure

Each test produces:

1. **Status**: Passed, Failed, or Error
2. **Details**: Specific measurements and findings
3. **Timestamp**: When the test was run

### Example Output

```json
{
  "goal": "Performance Metrics & Load Times",
  "status": "Passed",
  "details": {
    "total_load_time": "2.34s",
    "dns_lookup": "45.23ms",
    "tcp_connection": "23.45ms",
    "dom_content_loaded": "1234.56ms",
    "load_complete": "234.56ms"
  },
  "timestamp": "2024-12-11T00:00:00"
}
```

### AI Analysis

The AI provides:

1. **Summary**: Overview of findings for each goal
2. **Recommendations**: Specific suggestions for improvement
3. **Critical Issues**: Problems that need immediate attention

Example AI Report:
```json
{
  "report_summary": {
    "Performance": "Page loads in 2.3s, within acceptable range",
    "Accessibility": "5 images missing alt text, h1 count: 1",
    "Navigation": "All navigation successful, no redirects"
  },
  "recommendations": [
    "Add alt text to product images",
    "Optimize image sizes to reduce load time",
    "Add ARIA labels to navigation menu"
  ],
  "critical_issues": []
}
```

## Test Goals Explained

### 1. Browser Navigation & URL Validation

**What it tests:**
- Can the browser navigate to the URL?
- What's the HTTP status code?
- Are there any redirects?
- How long does navigation take?

**When to use:**
- Verifying site is accessible
- Checking for broken links
- Monitoring uptime
- Validating redirects

**Example results:**
```
✓ Navigation successful
  Status Code: 200
  Load Time: 1.23s
  Final URL: https://dpengeneering.site
```

### 2. Page Element & Content Integrity

**What it tests:**
- Are key page elements present?
- Does the page have proper structure?
- How many links and images?
- Is there meaningful content?

**When to use:**
- Ensuring page loaded completely
- Validating page structure
- Checking for missing elements
- Content verification

**Example results:**
```
✓ Elements verified
  Has Header: Yes
  Has Main: Yes
  Has Footer: Yes
  Links: 45
  Images: 12
  Content Length: 5,234 characters
```

### 3. Performance Metrics & Load Times

**What it tests:**
- How long does the page take to load?
- DNS lookup time
- Server connection time
- DOM processing time

**When to use:**
- Performance monitoring
- Identifying bottlenecks
- Comparing different versions
- Meeting performance budgets

**Example results:**
```
✓ Performance acceptable
  Total Load: 2.34s
  DNS Lookup: 45ms
  TCP Connect: 23ms
  DOM Content: 1,234ms
```

### 4. Accessibility Conformance (WCAG)

**What it tests:**
- Images have alt text?
- Proper HTML lang attribute?
- ARIA labels present?
- Heading hierarchy correct?
- Viewport meta tag present?

**When to use:**
- Legal compliance (ADA, Section 508)
- Improving user experience
- Supporting screen readers
- Ensuring keyboard navigation

**Example results:**
```
⚠ Accessibility issues found
  Lang Attribute: Yes
  Viewport Meta: Yes
  Images with Alt: 7/12 (5 missing)
  ARIA Elements: 3
  H1 Count: 1 (Correct)
  Issues:
    - 5 images missing alt text
```

### 5. Form Interaction & Data Submission

**What it tests:**
- Are forms present?
- Are inputs interactable?
- Can forms be submitted?
- Do buttons work?

**When to use:**
- Testing contact forms
- Validating search functionality
- Checking login/signup forms
- E-commerce checkout testing

**Example results:**
```
✓ Forms functional
  Forms Found: 1
  Inputs: 4
  Buttons: 2
  First Input Interactable: Yes
```

### 6. Screenshot & Visual Regression

**What it tests:**
- Captures full-page screenshot
- Saves with timestamp
- Stores for comparison

**When to use:**
- Visual regression testing
- Documenting page state
- Before/after comparisons
- Bug reporting

**Example results:**
```
✓ Screenshot captured
  Path: screenshots/dpengineering_20241211_120000.png
  Full Page: Yes
```

## Advanced Usage

### Custom Test Suites

Access pre-defined test suites in Python:

```python
from test_cases import TestCases

# Get e-commerce test suite
ecommerce_tests = TestCases.get_ecommerce_tests()

# Get all available suites
all_suites = TestCases.get_all_test_suites()
```

### Programmatic Testing

Create custom test scripts:

```python
from qa_automation import QAAutomation

# Initialize automation
qa = QAAutomation(
    project_name="Custom Test",
    target_url="https://example.com",
    selected_goals={
        "Performance Metrics & Load Times": True,
        "Accessibility Conformance (WCAG)": True
    },
    selenium_options={"headless": True},
    gemini_api_key="your-api-key"
)

# Run tests
results = qa.execute()

# Process results
print(f"Status: {results['status']}")
for test in results['tests']:
    print(f"{test['goal']}: {test['status']}")
```

### Scheduling Tests

Use cron to schedule regular tests:

```bash
# Edit crontab
crontab -e

# Add this line to test daily at 3 AM:
0 3 * * * cd /path/to/dpengeneering/backend && python test_example.py >> /var/log/qa-tests.log 2>&1
```

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Run QA Tests
  run: |
    cd backend
    pip install -r requirements.txt
    playwright install chromium
    python test_example.py
```

## Troubleshooting

### Backend Won't Start

**Problem**: Port 5000 already in use

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in app.py
```

### Playwright Errors

**Problem**: "Browser not found"

**Solution**:
```bash
# Reinstall browsers
playwright install --force chromium

# Install system dependencies
playwright install-deps
```

### Selenium Errors

**Problem**: "ChromeDriver not found"

**Solution**:
```bash
# The system uses webdriver-manager which auto-downloads
# But you can manually install Chrome:
sudo apt-get install google-chrome-stable
```

### API Key Errors

**Problem**: "API key invalid"

**Solution**:
1. Check if GEMINI_API_KEY is set
2. Verify the API key is correct
3. Check your Google Cloud Console

### Timeout Errors

**Problem**: Tests timing out

**Solution**:
- Increase timeout in qa_automation.py
- Check internet connection
- Try with headless=False to see what's happening

### Memory Issues

**Problem**: "Out of memory"

**Solution**:
```bash
# Close other applications
# Or add swap space:
sudo fallocate -l 2G /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Best Practices

### 1. Test Regularly

Run tests:
- After every deployment
- Before major releases
- Weekly for monitoring
- After significant changes

### 2. Start Small

Begin with:
- Navigation tests
- Element integrity
- Then add performance
- Finally accessibility

### 3. Review AI Insights

The AI can identify:
- Patterns you might miss
- Potential UX issues
- Performance bottlenecks
- Accessibility violations

### 4. Keep History

Test history helps:
- Track improvements
- Identify regressions
- Document issues
- Show progress over time

### 5. Act on Results

Don't just test:
- Fix identified issues
- Re-test after fixes
- Document changes
- Monitor trends

## Getting Help

If you encounter issues:

1. **Check Logs**
   ```bash
   # Backend logs
   tail -f backend/*.log
   
   # System logs
   journalctl -u qa-tester -f
   ```

2. **Test Backend Health**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Review Documentation**
   - QA_TESTER_README.md
   - DEPLOYMENT.md
   - backend/README.md

4. **GitHub Issues**
   - Report bugs
   - Request features
   - Share feedback

## Next Steps

Now that you know how to use the QA Tester:

1. **Test Your Site**: Run your first test on dpengeneering.site
2. **Review Results**: Understand what the tests found
3. **Fix Issues**: Address problems identified
4. **Re-test**: Verify fixes work
5. **Automate**: Set up scheduled tests
6. **Deploy**: Deploy to production (see DEPLOYMENT.md)

Happy Testing! 🚀
