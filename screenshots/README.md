# Screenshots Directory

This directory contains visual documentation of the QA Tester webapp.

## How to View the Webapp

### Quick Start
```bash
# 1. Start backend
cd backend
export GEMINI_API_KEY='your-key'
python app.py

# 2. Open frontend in browser
open ../public/index.html
# Or navigate to file:///path/to/public/index.html
```

### Pages Available
- `#home` - Home page with hero and capabilities  
- `#tasks` - Create new QA test
- `#history` - View past test results

## Screenshot Descriptions

### 1. home.png - Home Page
- Hero section with "Mister Mind" branding
- 4 capability cards (PLAN & EXECUTE, SELENIUM EXPERT, etc.)
- Dark theme by default
- Responsive navigation

### 2. tasks.png - Tasks Page (Main Interface)
- Project name input
- Target URL input
- 6 automation goal checkboxes with icons
- "PLAN & EXECUTE" button
- Real-time console output area
- Form validation

### 3. test-running.png - Test in Progress
- Console showing colored logs
- Spinner animation
- Timestamps on each log entry
- Auto-scrolling output

### 4. history.png - History Page
- List of completed projects
- Expandable detailed reports
- Status badges (Completed/Failed)
- Clickable URLs
- Refresh button

### 5. settings.png - Settings Modal
- Backend URL configuration
- API key input (secured)
- Selenium options (JSON)
- Save/Cancel buttons
- Blur backdrop

### 6. light-mode.png - Light Theme
- Complete color scheme switch
- Blue primary color
- White backgrounds
- Better readability in daylight

### 7. mobile-portrait.png - Mobile View (375px)
- Single column layout
- Stacked navigation
- Large touch targets
- Full-width buttons

### 8. mobile-landscape.png - Mobile Landscape (667px)
- Optimized for horizontal viewing
- Two-column checkbox grid
- Compact layout

### 9. tablet.png - Tablet View (768px)
- Desktop-like experience
- 2-3 column layouts
- Wider content area

### 10. toasts.png - Notifications
- Success toast (green)
- Error toast (red)
- Warning toast (yellow)
- Info toast (blue)
- Slide-in animations

## Generate Screenshots Automatically

Use this Python script with Playwright:

```python
from playwright.sync_api import sync_playwright
import os

def capture_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # Desktop screenshots
        page = browser.new_page(viewport={'width': 1200, 'height': 800})
        base_url = 'file://' + os.path.abspath('../public/index.html')
        
        # Home page
        page.goto(base_url + '#home')
        page.wait_for_timeout(1000)
        page.screenshot(path='home.png')
        
        # Tasks page
        page.goto(base_url + '#tasks')
        page.wait_for_timeout(1000)
        page.screenshot(path='tasks.png')
        
        # History page
        page.goto(base_url + '#history')
        page.wait_for_timeout(1000)
        page.screenshot(path='history.png')
        
        # Light mode
        page.goto(base_url + '#home')
        page.click('#theme-toggle')
        page.wait_for_timeout(500)
        page.screenshot(path='light-mode.png')
        
        # Mobile views
        page.set_viewport_size({'width': 375, 'height': 667})
        page.goto(base_url + '#tasks')
        page.wait_for_timeout(1000)
        page.screenshot(path='mobile-portrait.png')
        
        browser.close()
        print("✅ Screenshots captured successfully!")

if __name__ == '__main__':
    capture_screenshots()
```

Save as `generate_screenshots.py` and run:
```bash
python generate_screenshots.py
```

## Manual Screenshot Tips

**macOS**: Cmd+Shift+4 → Select area
**Windows**: Win+Shift+S → Screenshot tool
**Linux**: PrtScn or Spectacle

**Browser DevTools**:
1. F12 → Open DevTools
2. Ctrl+Shift+M → Device toolbar
3. Select device preset
4. Take screenshot

## Viewing Live

The webapp is fully functional without screenshots. Just open `public/index.html` in any modern browser to see it in action!

**Features to demonstrate:**
- ✅ Navigate between pages (click nav links)
- ✅ Toggle theme (sun/moon icon)
- ✅ Fill form and submit (requires backend)
- ✅ Open settings modal
- ✅ Resize browser to see responsive design
- ✅ View on mobile device
