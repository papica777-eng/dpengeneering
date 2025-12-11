"""
QA Automation Module - Integrates Playwright and Selenium for comprehensive testing
"""

import asyncio
from playwright.async_api import async_playwright
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, WebDriverException
import time
import os
from datetime import datetime
import json
import google.generativeai as genai


class QAAutomation:
    """Main class for QA automation using Playwright and Selenium"""
    
    def __init__(self, project_name, target_url, selected_goals, selenium_options=None, gemini_api_key=None):
        self.project_name = project_name
        self.target_url = target_url
        self.selected_goals = selected_goals
        self.selenium_options = selenium_options or {}
        self.gemini_api_key = gemini_api_key
        self.results = {
            'status': 'Pending',
            'tests': [],
            'screenshots': [],
            'errors': []
        }
        
        # Note: Gemini API key configuration is done per-request to avoid
        # thread safety issues in multi-threaded environments
    
    def execute(self):
        """Execute all selected automation goals"""
        try:
            # Execute Playwright tests
            playwright_results = asyncio.run(self._run_playwright_tests())
            
            # Execute Selenium tests
            selenium_results = self._run_selenium_tests()
            
            # Combine results
            self.results['tests'].extend(playwright_results)
            self.results['tests'].extend(selenium_results)
            
            # Use AI to analyze for bugs
            if self.gemini_api_key:
                ai_analysis = self._ai_bug_detection()
                self.results['ai_analysis'] = ai_analysis
            
            # Determine overall status
            failed_tests = [t for t in self.results['tests'] if t.get('status') == 'Failed']
            if failed_tests:
                self.results['status'] = 'Completed with Failures'
            else:
                self.results['status'] = 'Completed'
            
            return self.results
            
        except Exception as e:
            self.results['status'] = 'Failed'
            self.results['errors'].append(str(e))
            return self.results
    
    async def _run_playwright_tests(self):
        """Run Playwright-based tests"""
        test_results = []
        
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    viewport={'width': 1920, 'height': 1080}
                )
                page = await context.new_page()
                
                # Browser Navigation & URL Validation
                if self.selected_goals.get('Browser Navigation & URL Validation'):
                    nav_result = await self._test_navigation(page)
                    test_results.append(nav_result)
                
                # Page Element & Content Integrity
                if self.selected_goals.get('Page Element & Content Integrity'):
                    element_result = await self._test_elements(page)
                    test_results.append(element_result)
                
                # Performance Metrics & Load Times
                if self.selected_goals.get('Performance Metrics & Load Times'):
                    perf_result = await self._test_performance(page)
                    test_results.append(perf_result)
                
                # Accessibility Conformance
                if self.selected_goals.get('Accessibility Conformance (WCAG)'):
                    a11y_result = await self._test_accessibility(page)
                    test_results.append(a11y_result)
                
                # Screenshot & Visual Regression
                if self.selected_goals.get('Screenshot & Visual Regression'):
                    screenshot_result = await self._capture_screenshot(page)
                    test_results.append(screenshot_result)
                
                await browser.close()
                
        except Exception as e:
            test_results.append({
                'goal': 'Playwright Tests',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
        
        return test_results
    
    async def _test_navigation(self, page):
        """Test browser navigation and URL validation"""
        try:
            start_time = time.time()
            response = await page.goto(self.target_url, wait_until='networkidle')
            load_time = time.time() - start_time
            
            current_url = page.url
            status_code = response.status if response else 'Unknown'
            
            return {
                'goal': 'Browser Navigation & URL Validation',
                'status': 'Passed' if status_code < 400 else 'Failed',
                'details': {
                    'target_url': self.target_url,
                    'final_url': current_url,
                    'status_code': status_code,
                    'load_time': f'{load_time:.2f}s'
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Browser Navigation & URL Validation',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def _test_elements(self, page):
        """Test page elements and content integrity"""
        try:
            # Wait for page to be ready
            await page.wait_for_load_state('networkidle')
            
            # Get page title
            title = await page.title()
            
            # Check for common elements
            has_header = await page.query_selector('header, [role="banner"]') is not None
            has_main = await page.query_selector('main, [role="main"]') is not None
            has_footer = await page.query_selector('footer, [role="contentinfo"]') is not None
            
            # Count links and images
            links_count = len(await page.query_selector_all('a'))
            images_count = len(await page.query_selector_all('img'))
            
            # Get text content length
            body_text = await page.text_content('body') or ''
            
            return {
                'goal': 'Page Element & Content Integrity',
                'status': 'Passed',
                'details': {
                    'title': title,
                    'has_header': has_header,
                    'has_main': has_main,
                    'has_footer': has_footer,
                    'links_count': links_count,
                    'images_count': images_count,
                    'content_length': len(body_text)
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Page Element & Content Integrity',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def _test_performance(self, page):
        """Test performance metrics and load times"""
        try:
            # Navigate and measure performance
            start_time = time.time()
            await page.goto(self.target_url, wait_until='load')
            load_time = time.time() - start_time
            
            # Get performance metrics using JavaScript
            metrics = await page.evaluate('''() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                return {
                    dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
                    tcp_time: perfData.connectEnd - perfData.connectStart,
                    dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    load_complete: perfData.loadEventEnd - perfData.loadEventStart
                };
            }''')
            
            return {
                'goal': 'Performance Metrics & Load Times',
                'status': 'Passed',
                'details': {
                    'total_load_time': f'{load_time:.2f}s',
                    'dns_lookup': f'{metrics.get("dns_time", 0):.2f}ms',
                    'tcp_connection': f'{metrics.get("tcp_time", 0):.2f}ms',
                    'dom_content_loaded': f'{metrics.get("dom_content_loaded", 0):.2f}ms',
                    'load_complete': f'{metrics.get("load_complete", 0):.2f}ms'
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Performance Metrics & Load Times',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def _test_accessibility(self, page):
        """Test accessibility conformance (WCAG)"""
        try:
            # Navigate to page
            await page.goto(self.target_url, wait_until='networkidle')
            
            # Check for common accessibility features
            has_lang = await page.evaluate('() => document.documentElement.hasAttribute("lang")')
            has_viewport = await page.query_selector('meta[name="viewport"]') is not None
            
            # Check for alt text on images
            images = await page.query_selector_all('img')
            images_with_alt = 0
            for img in images:
                alt = await img.get_attribute('alt')
                if alt is not None:
                    images_with_alt += 1
            
            # Check for ARIA labels
            aria_elements = len(await page.query_selector_all('[aria-label], [aria-labelledby]'))
            
            # Check for heading structure
            h1_count = len(await page.query_selector_all('h1'))
            
            issues = []
            if not has_lang:
                issues.append('Missing lang attribute on html element')
            if not has_viewport:
                issues.append('Missing viewport meta tag')
            if images and images_with_alt < len(images):
                issues.append(f'{len(images) - images_with_alt} images missing alt text')
            if h1_count == 0:
                issues.append('No h1 heading found')
            elif h1_count > 1:
                issues.append(f'Multiple h1 headings found ({h1_count})')
            
            return {
                'goal': 'Accessibility Conformance (WCAG)',
                'status': 'Passed' if not issues else 'Failed',
                'details': {
                    'has_lang_attribute': has_lang,
                    'has_viewport_meta': has_viewport,
                    'images_with_alt': f'{images_with_alt}/{len(images)}',
                    'aria_elements': aria_elements,
                    'h1_count': h1_count,
                    'issues': issues
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Accessibility Conformance (WCAG)',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def _capture_screenshot(self, page):
        """Capture screenshot for visual regression"""
        try:
            await page.goto(self.target_url, wait_until='networkidle')
            
            # Create screenshots directory
            os.makedirs('screenshots', exist_ok=True)
            
            # Generate filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'screenshots/{self.project_name.replace(" ", "_")}_{timestamp}.png'
            
            # Take screenshot
            await page.screenshot(path=filename, full_page=True)
            
            self.results['screenshots'].append(filename)
            
            return {
                'goal': 'Screenshot & Visual Regression',
                'status': 'Passed',
                'details': {
                    'screenshot_path': filename,
                    'full_page': True
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Screenshot & Visual Regression',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _run_selenium_tests(self):
        """Run Selenium-based tests for additional coverage"""
        test_results = []
        
        try:
            # Setup Chrome options
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            
            window_size = self.selenium_options.get('windowSize', '1920,1080')
            chrome_options.add_argument(f'--window-size={window_size}')
            
            # Initialize driver
            driver = webdriver.Chrome(options=chrome_options)
            
            # Form Interaction & Data Submission
            if self.selected_goals.get('Form Interaction & Data Submission'):
                form_result = self._test_forms(driver)
                test_results.append(form_result)
            
            # Additional navigation test with Selenium
            if self.selected_goals.get('Browser Navigation & URL Validation'):
                selenium_nav_result = self._test_selenium_navigation(driver)
                test_results.append(selenium_nav_result)
            
            driver.quit()
            
        except Exception as e:
            test_results.append({
                'goal': 'Selenium Tests',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
        
        return test_results
    
    def _test_selenium_navigation(self, driver):
        """Test navigation using Selenium"""
        try:
            start_time = time.time()
            driver.get(self.target_url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, 'body'))
            )
            
            load_time = time.time() - start_time
            current_url = driver.current_url
            page_title = driver.title
            
            return {
                'goal': 'Browser Navigation (Selenium)',
                'status': 'Passed',
                'details': {
                    'target_url': self.target_url,
                    'final_url': current_url,
                    'page_title': page_title,
                    'load_time': f'{load_time:.2f}s'
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Browser Navigation (Selenium)',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _test_forms(self, driver):
        """Test form interactions"""
        try:
            driver.get(self.target_url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, 'body'))
            )
            
            # Find all forms
            forms = driver.find_elements(By.TAG_NAME, 'form')
            
            # Find all input fields
            inputs = driver.find_elements(By.CSS_SELECTOR, 'input, textarea, select')
            
            # Find all buttons
            buttons = driver.find_elements(By.CSS_SELECTOR, 'button, input[type="submit"]')
            
            details = {
                'forms_count': len(forms),
                'inputs_count': len(inputs),
                'buttons_count': len(buttons),
                'forms_present': len(forms) > 0
            }
            
            # If forms exist, try to interact (safely)
            if forms and inputs:
                try:
                    # Just check if forms are interactable, don't actually submit
                    first_input = inputs[0]
                    is_enabled = first_input.is_enabled()
                    is_displayed = first_input.is_displayed()
                    details['first_input_interactable'] = is_enabled and is_displayed
                except:
                    details['first_input_interactable'] = False
            
            return {
                'goal': 'Form Interaction & Data Submission',
                'status': 'Passed',
                'details': details,
                'timestamp': datetime.now().isoformat()
            }
        except TimeoutException:
            return {
                'goal': 'Form Interaction & Data Submission',
                'status': 'Failed',
                'error': 'Page load timeout',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'goal': 'Form Interaction & Data Submission',
                'status': 'Failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _ai_bug_detection(self):
        """Use Gemini AI to analyze results and detect potential bugs"""
        try:
            # Configure API key for this request only (thread-safe)
            if self.gemini_api_key:
                genai.configure(api_key=self.gemini_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            prompt = f"""
            As an expert QA tester, analyze these test results and identify potential bugs or issues:
            
            Project: {self.project_name}
            URL: {self.target_url}
            
            Test Results:
            {json.dumps(self.results, indent=2)}
            
            Please identify:
            1. Potential bugs or issues
            2. Performance concerns
            3. Accessibility violations
            4. Security risks
            5. User experience problems
            
            Provide your analysis as a structured JSON with keys: "bugs" (array), "performance_issues" (array), "accessibility_issues" (array), "ux_issues" (array)
            """
            
            response = model.generate_content(prompt)
            
            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                return {
                    'analysis': response.text[:1000],
                    'bugs': [],
                    'performance_issues': [],
                    'accessibility_issues': [],
                    'ux_issues': []
                }
                
        except Exception as e:
            return {
                'error': str(e),
                'bugs': [],
                'performance_issues': [],
                'accessibility_issues': [],
                'ux_issues': []
            }
