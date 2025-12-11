# QA Tester Deployment Guide

## Overview

This document describes how to deploy the full-stack QA Tester application to dpengeneering.site.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (HTML/React)   │
│  Port 80/443    │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Backend       │
│  (Flask/Python) │
│   Port 5000     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│Playwright│ │Selenium│
└──────┘  └───────┘
    │         │
    └────┬────┘
         │
    ┌────▼────┐
    │ Gemini  │
    │   API   │
    └─────────┘
```

## Prerequisites

### Server Requirements
- Ubuntu 20.04 or later
- Python 3.9+
- Node.js 16+ (for Playwright)
- At least 2GB RAM
- 10GB disk space
- Domain: dpengeneering.site

### Software Dependencies
```bash
# System packages
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv nginx certbot python3-certbot-nginx

# Chrome/Chromium for Selenium and Playwright
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

## Installation Steps

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/papica777-eng/dpengeneering.git
cd dpengeneering
sudo chown -R $USER:$USER .
```

### 2. Setup Python Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
playwright install-deps
```

### 3. Configure Environment Variables

```bash
# Create .env file
# IMPORTANT: Replace YOUR_ACTUAL_API_KEY with your real Gemini API key
cat > .env << EOF
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY
FLASK_ENV=production
PORT=5000
EOF

# Secure the file
chmod 600 .env
```

### 4. Setup Frontend

The frontend is already in `public/index.html`. No additional setup needed.

### 5. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/dpengeneering.site
```

Add the following configuration:

```nginx
# Backend API
upstream qa_backend {
    server 127.0.0.1:5000;
}

# Main site
server {
    listen 80;
    server_name dpengeneering.site www.dpengeneering.site;

    # Frontend
    root /var/www/dpengeneering/public;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://qa_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts for long-running tests
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }

    # Screenshots directory
    location /screenshots/ {
        alias /var/www/dpengeneering/backend/screenshots/;
        autoindex off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dpengeneering.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL Certificate

```bash
sudo certbot --nginx -d dpengeneering.site -d www.dpengeneering.site
```

Follow the prompts to configure automatic HTTPS redirect.

### 7. Create Systemd Service

Create the backend service:

```bash
sudo nano /etc/systemd/system/qa-tester.service
```

Add:

```ini
[Unit]
Description=QA Tester Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/dpengeneering/backend
Environment="PATH=/var/www/dpengeneering/backend/venv/bin"
EnvironmentFile=/var/www/dpengeneering/backend/.env
ExecStart=/var/www/dpengeneering/backend/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable qa-tester
sudo systemctl start qa-tester
sudo systemctl status qa-tester
```

### 8. Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 9. Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/qa-tester
```

Add:

```
/var/www/dpengeneering/backend/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

## Post-Deployment

### 1. Update Frontend Configuration

Edit `public/index.html` and update the backend URL:

```javascript
const backendUrl = 'https://dpengeneering.site/api';
```

### 2. Test the Deployment

```bash
# Test backend health
curl https://dpengeneering.site/api/health

# Test from browser
https://dpengeneering.site
```

### 3. Monitor Logs

```bash
# Backend logs
sudo journalctl -u qa-tester -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Maintenance

### Updating the Application

```bash
cd /var/www/dpengeneering
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart qa-tester
```

### Backup

```bash
# Backup test history
sudo tar -czf /backups/qa-history-$(date +%Y%m%d).tar.gz /var/www/dpengeneering/backend/history/

# Backup screenshots
sudo tar -czf /backups/qa-screenshots-$(date +%Y%m%d).tar.gz /var/www/dpengeneering/backend/screenshots/
```

### Database Cleanup

```bash
# Clean old screenshots (older than 30 days)
find /var/www/dpengeneering/backend/screenshots/ -name "*.png" -mtime +30 -delete

# Keep only last 100 test results
cd /var/www/dpengeneering/backend
python3 << EOF
import json
with open('history/test_history.json', 'r') as f:
    history = json.load(f)
with open('history/test_history.json', 'w') as f:
    json.dump(history[:100], f, indent=2)
EOF
```

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
sudo journalctl -u qa-tester -n 50

# Test manually
cd /var/www/dpengeneering/backend
source venv/bin/activate
python app.py
```

### Playwright/Selenium Issues

```bash
# Reinstall browsers
cd /var/www/dpengeneering/backend
source venv/bin/activate
playwright install chromium --with-deps

# Check Chrome
google-chrome --version
```

### Permission Issues

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/dpengeneering/backend/screenshots
sudo chown -R www-data:www-data /var/www/dpengeneering/backend/history
sudo chown -R www-data:www-data /var/www/dpengeneering/backend/test_results
```

### Memory Issues

If tests fail due to memory:

```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Security Best Practices

1. **API Key Management**
   - Store API key in environment variables
   - Never commit API keys to git
   - Rotate keys periodically

2. **Rate Limiting**
   - Implement rate limiting in nginx
   - Limit concurrent test executions

3. **Access Control**
   - Add authentication to API endpoints
   - Use Firebase Auth or JWT tokens

4. **SSL/TLS**
   - Keep certificates up to date
   - Enable HSTS headers

5. **Regular Updates**
   - Update system packages weekly
   - Update Python packages monthly
   - Update Playwright/Selenium as needed

## Performance Optimization

### 1. Enable Redis Caching (Optional)

```bash
sudo apt-get install redis-server
pip install redis flask-caching
```

### 2. Use CDN for Static Assets

Configure CloudFlare or similar CDN for:
- Frontend assets
- Screenshots (if public)

### 3. Scale Horizontally

For high load:
- Deploy multiple backend instances
- Use load balancer
- Separate test execution servers

## Monitoring

### Setup Monitoring (Optional)

```bash
# Install monitoring tools
sudo apt-get install python3-prometheus-client
```

Add health check monitoring:
- Uptime monitoring: UptimeRobot or similar
- Error tracking: Sentry
- Performance: New Relic or DataDog

## Support

For issues or questions:
- GitHub Issues: https://github.com/papica777-eng/dpengeneering/issues
- Documentation: See README.md and USAGE_EXAMPLES.js

---

**Last Updated**: December 2024
**Maintainer**: dpengineering team
