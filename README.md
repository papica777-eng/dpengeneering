# dpengineering - Full-Stack QA Testing Platform

> AI-powered web application testing with Playwright, Selenium, and Gemini AI

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

## 🚀 START THE APP (EASIEST METHOD!)

### Interactive Setup (Recommended)

```bash
# 1. Setup API key (interactive, guided)
./SETUP_API_KEY.sh

# 2. Start the app!
./START.sh
```

**That's it!** Server runs at `http://localhost:5000` 🎉

The setup script will:
- Guide you to get a free Gemini API key
- Save it securely in `.env` file
- Prepare everything to run

### Quick Manual Start

```bash
# 1. Get API key: https://makersuite.google.com/app/apikey
export GEMINI_API_KEY='your-api-key-here'

# 2. Start it!
./START.sh
```

> **Demo mode**: Run `./START.sh --demo` to check setup without starting
> 
> **API Key Help**: See [API_KEY_SETUP.md](API_KEY_SETUP.md) for detailed setup options

### Alternative: Deploy to Render (5 Minutes)

Click the button above or follow these steps:

1. Fork this repository
2. Sign up at [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
6. Deploy!

Your backend will be live at `https://your-app.onrender.com`

### Manual Setup (If Needed)

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
5. Use setup script: `./SETUP_API_KEY.sh`

**Security**: Never commit API keys! Use `.env` file or environment variables.

## 📚 Documentation

- **[API_KEY_SETUP.md](API_KEY_SETUP.md)** - Complete API key setup guide
- **[START_APP.md](START_APP.md)** - All startup methods
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Cloud deployment
- **[QA_TESTER_README.md](QA_TESTER_README.md)** - Complete feature guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Self-hosting guide (Nginx, SSL)
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Step-by-step tutorial

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
- ✅ `.env` file support (in `.gitignore`)
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

## 🚀 Quick Commands

```bash
# Interactive setup (recommended)
./SETUP_API_KEY.sh

# Start the app
./START.sh

# Demo mode (check setup)
./START.sh --demo

# Manual API key
export GEMINI_API_KEY='your-key'
./START.sh
```

## 🆘 Need Help?

- Check [API_KEY_SETUP.md](API_KEY_SETUP.md) for API key issues
- Run `./START.sh --demo` to see what's needed
- See [QUICKSTART.md](QUICKSTART.md) for step-by-step guide
- Open an issue on GitHub

---

**Need Help?** Check out our [documentation](QA_TESTER_README.md) or open an issue!

**Want to Contribute?** We welcome pull requests!

**Like this project?** Give it a ⭐ on GitHub!
