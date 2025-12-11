"""
Pre-defined Test Cases for Common Testing Scenarios
"""


class TestCases:
    """Collection of reusable test cases"""
    
    @staticmethod
    def get_ecommerce_tests():
        """Test cases for e-commerce websites"""
        return {
            'name': 'E-Commerce Test Suite',
            'tests': [
                {
                    'name': 'Product Page Load',
                    'description': 'Verify product pages load correctly',
                    'checks': [
                        'Product image is visible',
                        'Product title is present',
                        'Price is displayed',
                        'Add to cart button exists'
                    ]
                },
                {
                    'name': 'Shopping Cart',
                    'description': 'Test shopping cart functionality',
                    'checks': [
                        'Items can be added',
                        'Quantity can be updated',
                        'Items can be removed',
                        'Total price calculates correctly'
                    ]
                },
                {
                    'name': 'Checkout Process',
                    'description': 'Verify checkout flow',
                    'checks': [
                        'Shipping information form',
                        'Payment method selection',
                        'Order review page',
                        'Confirmation page'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_form_validation_tests():
        """Test cases for form validation"""
        return {
            'name': 'Form Validation Test Suite',
            'tests': [
                {
                    'name': 'Required Fields',
                    'description': 'Test required field validation',
                    'checks': [
                        'Empty field shows error',
                        'Error message is clear',
                        'Form cannot be submitted with errors'
                    ]
                },
                {
                    'name': 'Email Validation',
                    'description': 'Test email field validation',
                    'checks': [
                        'Invalid email format rejected',
                        'Valid email format accepted',
                        'Error message shows for invalid email'
                    ]
                },
                {
                    'name': 'Password Strength',
                    'description': 'Test password validation',
                    'checks': [
                        'Minimum length enforced',
                        'Special characters required',
                        'Strength indicator updates'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_responsive_design_tests():
        """Test cases for responsive design"""
        return {
            'name': 'Responsive Design Test Suite',
            'tests': [
                {
                    'name': 'Mobile View',
                    'description': 'Test mobile viewport',
                    'viewport': {'width': 375, 'height': 667},
                    'checks': [
                        'Navigation menu collapses',
                        'Content is readable',
                        'Images scale properly',
                        'Buttons are touch-friendly'
                    ]
                },
                {
                    'name': 'Tablet View',
                    'description': 'Test tablet viewport',
                    'viewport': {'width': 768, 'height': 1024},
                    'checks': [
                        'Layout adjusts appropriately',
                        'Navigation is accessible',
                        'Content remains organized'
                    ]
                },
                {
                    'name': 'Desktop View',
                    'description': 'Test desktop viewport',
                    'viewport': {'width': 1920, 'height': 1080},
                    'checks': [
                        'Full navigation visible',
                        'Multi-column layout works',
                        'Large images display properly'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_accessibility_tests():
        """Test cases for accessibility"""
        return {
            'name': 'Accessibility Test Suite',
            'tests': [
                {
                    'name': 'Keyboard Navigation',
                    'description': 'Test keyboard-only navigation',
                    'checks': [
                        'Tab order is logical',
                        'Focus indicators visible',
                        'All interactive elements accessible',
                        'Skip links present'
                    ]
                },
                {
                    'name': 'Screen Reader',
                    'description': 'Test screen reader compatibility',
                    'checks': [
                        'Proper heading hierarchy',
                        'Alt text on images',
                        'ARIA labels present',
                        'Form labels associated'
                    ]
                },
                {
                    'name': 'Color Contrast',
                    'description': 'Test color contrast ratios',
                    'checks': [
                        'Text meets WCAG AA standard',
                        'Links are distinguishable',
                        'Focus indicators contrast',
                        'Hover states visible'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_performance_tests():
        """Test cases for performance"""
        return {
            'name': 'Performance Test Suite',
            'tests': [
                {
                    'name': 'Page Load Time',
                    'description': 'Measure page load performance',
                    'thresholds': {
                        'first_contentful_paint': 1.8,  # seconds
                        'time_to_interactive': 3.8,
                        'total_load_time': 5.0
                    }
                },
                {
                    'name': 'Resource Optimization',
                    'description': 'Check resource optimization',
                    'checks': [
                        'Images are compressed',
                        'CSS/JS minified',
                        'Caching headers set',
                        'Lazy loading implemented'
                    ]
                },
                {
                    'name': 'Network Requests',
                    'description': 'Analyze network requests',
                    'checks': [
                        'Minimize HTTP requests',
                        'Use HTTP/2 or HTTP/3',
                        'Compress responses',
                        'Optimize asset delivery'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_security_tests():
        """Test cases for security"""
        return {
            'name': 'Security Test Suite',
            'tests': [
                {
                    'name': 'HTTPS',
                    'description': 'Verify HTTPS implementation',
                    'checks': [
                        'Site uses HTTPS',
                        'Valid SSL certificate',
                        'HTTP redirects to HTTPS',
                        'Secure cookies'
                    ]
                },
                {
                    'name': 'Headers',
                    'description': 'Check security headers',
                    'checks': [
                        'Content-Security-Policy',
                        'X-Frame-Options',
                        'X-Content-Type-Options',
                        'Strict-Transport-Security'
                    ]
                },
                {
                    'name': 'Input Validation',
                    'description': 'Test input sanitization',
                    'checks': [
                        'XSS prevention',
                        'SQL injection protection',
                        'CSRF tokens',
                        'Rate limiting'
                    ]
                }
            ]
        }
    
    @staticmethod
    def get_all_test_suites():
        """Get all available test suites"""
        return {
            'ecommerce': TestCases.get_ecommerce_tests(),
            'forms': TestCases.get_form_validation_tests(),
            'responsive': TestCases.get_responsive_design_tests(),
            'accessibility': TestCases.get_accessibility_tests(),
            'performance': TestCases.get_performance_tests(),
            'security': TestCases.get_security_tests()
        }
