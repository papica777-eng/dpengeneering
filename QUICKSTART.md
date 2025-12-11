# 🚀 Quick Start Guide

Get the QA Tester running in 5 minutes!

## Choose Your Path

### 🌐 Cloud Deployment (Easiest)

**Perfect for: Production use, sharing with team**

1. **Get API Key** (2 minutes)
   - Visit https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy it!

2. **Deploy to Render** (3 minutes)
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect this repository
   - Set environment variable: `GEMINI_API_KEY=your-key`
   - Click "Create Web Service"
   - Wait ~5 minutes for first deploy
   - Done! ✅

👉 **Detailed Guide**: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

### 💻 Local Development

**Perfect for: Testing locally, development**

```bash
# 1. Clone (if not already)
git clone https://github.com/papica777-eng/dpengeneering.git
cd dpengeneering/backend

# 2. Install dependencies
pip install -r requirements.txt
playwright install chromium

# 3. Set your API key
export GEMINI_API_KEY='your-api-key-here'

# 4. Run!
python app.py
```

Then open `public/index.html` in your browser!

👉 **Need Help?** See [USAGE_GUIDE.md](USAGE_GUIDE.md)

## First Test

Once running, test it works:

### Via Web UI
1. Open the interface
2. Project Name: "Test Run"
3. URL: "https://google.com"
4. Select: "Browser Navigation"
5. Click "Start Automation"
6. See results! ✅

### Via API
```bash
# Replace with your backend URL
curl -X POST http://localhost:5000/api/qa_project \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Google Test",
    "target_url": "https://google.com",
    "selected_goals": {
      "Browser Navigation & URL Validation": true
    }
  }'
```

### Via Python
```python
# In backend directory
python test_example.py
```

## Common Issues

### "GEMINI_API_KEY environment variable is required"
**Solution**: Set your API key
```bash
export GEMINI_API_KEY='your-key-here'
```

### "Port 5000 already in use"
**Solution**: Kill the process or use different port
```bash
# Find process
lsof -i :5000
# Kill it
kill -9 <PID>
```

### "playwright not found"
**Solution**: Install Playwright browsers
```bash
playwright install chromium
```

### "Module not found"
**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

## What's Next?

### Learn More
- [Full Documentation](QA_TESTER_README.md)
- [API Reference](backend/README.md)
- [Deployment Guide](DEPLOYMENT.md)

### Try Features
- Test your own website
- Try all 6 test categories
- Check AI-powered insights
- Review test history

### Customize
- Add custom test cases
- Integrate with CI/CD
- Schedule automated tests
- Build on the API

## Need Help?

1. **Check Documentation**: We have 4 detailed guides
2. **Run Setup Checker**: `python backend/check_setup.py`
3. **View Logs**: Check terminal output
4. **Open Issue**: GitHub Issues welcome!

## Success Checklist

- ✅ API key obtained
- ✅ Backend deployed/running
- ✅ Frontend opened
- ✅ First test completed
- ✅ Results reviewed

**🎉 You're all set! Start testing!**

---

**Quick Links:**
- [Deploy to Render](RENDER_DEPLOYMENT.md) ← Start here!
- [Local Setup](USAGE_GUIDE.md)
- [API Docs](backend/README.md)
- [Full Features](QA_TESTER_README.md)
