# dpengineering - Full-Stack QA Testing Platform

> AI-powered web application testing with Playwright, Selenium, and Gemini AI

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## 🚀 Quick Start

### Option 1: Deploy to Render (Recommended)

Click the button above or follow these steps:

1. Fork this repository
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
6. Deploy!

Your backend will be live at `https://your-app.onrender.com`

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/papica777-eng/dpengeneering.git
cd dpengeneering

# Setup backend
cd backend
pip install -r requirements.txt
playwright install chromium

# Set API key
export GEMINI_API_KEY='your-api-key-here'

# Start server
python app.py
```

Then open `public/index.html` in your browser!

## 🎯 What This Does

Automated QA testing platform that tests websites like a real person:

- **🤖 AI-Powered**: Gemini AI detects bugs intelligently
- **⚡ Fast**: Playwright for modern browser automation
- **🔄 Compatible**: Selenium for cross-browser testing
- **📊 Comprehensive**: 6 test categories
- **🎨 User-Friendly**: Beautiful web interface

## 🧪 Test Categories

1. **Browser Navigation** - URL validation, redirects, load times
2. **Element Integrity** - Page structure, content verification
3. **Performance** - Load times, DNS, TCP, DOM metrics
4. **Accessibility** - WCAG compliance, alt text, ARIA labels
5. **Form Testing** - Input fields, buttons, submissions
6. **Visual Regression** - Screenshots, visual comparison

## 📖 Usage

### Web Interface

1. Open the web interface at your deployed URL or `public/index.html`
2. Enter project name and target URL
3. Select test goals
4. Click "Start Automation"
5. Review AI-powered results!

### API

```bash
curl -X POST https://your-app.onrender.com/api/qa_project \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "My Site Test",
    "target_url": "https://example.com",
    "selected_goals": {
      "Browser Navigation & URL Validation": true,
      "Performance Metrics & Load Times": true
    }
  }'
```

### Python SDK

```python
from qa_automation import QAAutomation

qa = QAAutomation(
    project_name="Test",
    target_url="https://example.com",
    selected_goals={"Browser Navigation & URL Validation": True},
    gemini_api_key="your-api-key"
)

results = qa.execute()
print(results)
```

## 🔧 Configuration

### Environment Variables

Required:
- `GEMINI_API_KEY` - Your Google Gemini API key

Optional:
- `FLASK_ENV` - Set to `production` for production mode
- `PORT` - Server port (default: 5000)

### Get API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your key
5. Set as environment variable

## 📚 Documentation

- **[QA_TESTER_README.md](QA_TESTER_README.md)** - Complete feature guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Self-hosting guide (Nginx, SSL)
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Step-by-step tutorial
- **[backend/README.md](backend/README.md)** - API reference

## 🏗️ Architecture

```
Frontend (HTML/React)
    ↓
Flask REST API
    ↓
┌──────────┬─────────┬──────────┐
Playwright  Selenium  Gemini AI
```

## 🛠️ Tech Stack

- **Backend**: Python, Flask, Playwright, Selenium
- **Frontend**: HTML5, CSS3, JavaScript, React (optional)
- **AI**: Google Gemini API
- **Deployment**: Render, Docker, or traditional hosting

## 🔒 Security

- ✅ No API keys in code
- ✅ Environment variable configuration
- ✅ CodeQL security scanning passed
- ✅ CORS configured
- ✅ Input validation

## 📊 Project Stats

- **6 Test Categories** covering all major QA aspects
- **3 API Endpoints** for full automation control
- **AI-Powered Analysis** with actionable insights
- **Complete Documentation** with examples
- **Production Ready** with deployment guides

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Private project - © 2024 dpengineering

## 🎉 Features Highlight

### For Developers
- Complete Python SDK
- REST API access
- Pre-built test suites
- Easy integration

### For QA Teams
- No coding required (web UI)
- Comprehensive reports
- AI insights
- Test history

### For DevOps
- One-click Render deployment
- Docker support
- CI/CD ready
- Health monitoring

## 🚀 Deploy Now

Ready to test your website? 

1. **Quick**: Deploy to Render in 5 minutes
2. **Easy**: Just add your API key
3. **Free**: Start with Render's free tier

[Deploy to Render →](https://render.com)

---

**Need Help?** Check out our [documentation](QA_TESTER_README.md) or open an issue!

**Want to Contribute?** We welcome pull requests!

**Like this project?** Give it a ⭐ on GitHub!
