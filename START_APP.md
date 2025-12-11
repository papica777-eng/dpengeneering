# 🚀 START THE QA TESTER APP

## Quick Start (Choose One Method)

### Method 1: Render Cloud (Recommended - 5 Minutes)

**Best for**: Production use, sharing with team, no local setup needed

```bash
# 1. Get your Gemini API key
Visit: https://makersuite.google.com/app/apikey
Click "Create API Key"
Copy the key

# 2. Deploy to Render
Visit: https://render.com
Sign up/Login
Click "New +" → "Web Service"
Connect this GitHub repository
Set environment variable: GEMINI_API_KEY=your-key-here
Click "Create Web Service"

# Done! Your app will be live at: https://your-app.onrender.com
```

👉 **Full Guide**: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

### Method 2: Local Startup (Development)

**Best for**: Testing locally, development work

#### Step 1: Get API Key
```bash
# Visit https://makersuite.google.com/app/apikey
# Create and copy your API key
export GEMINI_API_KEY='your-api-key-here'
```

#### Step 2: Run the Startup Script
```bash
cd backend
./start.sh
```

The script will:
- ✅ Create virtual environment
- ✅ Install dependencies
- ✅ Install Playwright browsers
- ✅ Start the server at http://localhost:5000

#### Step 3: Open the Interface
```bash
# In a new terminal/browser
open ../public/index.html
# Or navigate to the file in your browser
```

---

### Method 3: Manual Startup (Step-by-Step)

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment (first time only)
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 4. Install dependencies (first time only)
pip install -r requirements.txt
playwright install chromium

# 5. Set API key
export GEMINI_API_KEY='your-api-key-here'

# 6. Start the server
python app.py
```

**Server will start at**: http://localhost:5000

---

### Method 4: Docker (Container)

```bash
# 1. Build the image
cd backend
docker build -t qa-tester .

# 2. Run the container
docker run -p 5000:5000 \
  -e GEMINI_API_KEY='your-api-key-here' \
  qa-tester

# Server running at: http://localhost:5000
```

---

## Verify It's Running

### Check Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "QA Tester Backend is running",
  "timestamp": "2024-12-11T..."
}
```

### Run a Quick Test
```bash
cd backend
python test_example.py
```

This will run a test against Google.com to verify everything works.

---

## Using the Application

### Web Interface (Easiest)

1. **Backend Running?** Make sure backend is started (see above)
2. **Open Frontend**: Open `public/index.html` in your browser
3. **Create Test**:
   - Project Name: "My First Test"
   - Target URL: "https://google.com"
   - Select test goals
   - Click "Start Automation"
4. **View Results**: See AI-powered analysis in real-time!

### API Usage

```bash
# Test any website
curl -X POST http://localhost:5000/api/qa_project \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "Google Test",
    "target_url": "https://google.com",
    "selected_goals": {
      "Browser Navigation & URL Validation": true,
      "Performance Metrics & Load Times": true
    }
  }'
```

### Python SDK

```python
from qa_automation import QAAutomation
import os

qa = QAAutomation(
    project_name="Test",
    target_url="https://example.com",
    selected_goals={
        "Browser Navigation & URL Validation": True
    },
    gemini_api_key=os.environ.get('GEMINI_API_KEY')
)

results = qa.execute()
print(results)
```

---

## Troubleshooting

### "GEMINI_API_KEY environment variable is required"

**Solution**: Set your API key
```bash
export GEMINI_API_KEY='your-key-here'
```

Get key from: https://makersuite.google.com/app/apikey

### "Port 5000 already in use"

**Solution**: Stop existing process or use different port
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port
PORT=8000 python app.py
```

### "playwright not found"

**Solution**: Install Playwright
```bash
pip install playwright
playwright install chromium
```

### Dependencies missing

**Solution**: Install all dependencies
```bash
cd backend
pip install -r requirements.txt
```

---

## What Happens When You Start?

1. **Backend Starts**: Flask server on port 5000
2. **APIs Available**:
   - `GET /api/health` - Health check
   - `POST /api/qa_project` - Run tests
   - `GET /api/qa_history` - View history
3. **Ready for Testing**: Can test any website!

---

## Quick Demo (30 seconds)

```bash
# Terminal 1: Start backend
cd backend
export GEMINI_API_KEY='your-key'
python app.py

# Terminal 2: Test it
curl http://localhost:5000/api/health

# Terminal 3: Open browser
open ../public/index.html
```

---

## Production Deployment

For production use, deploy to Render:

1. **Fork this repository**
2. **Visit**: https://render.com
3. **Create Web Service**
4. **Connect repository**
5. **Set**: `GEMINI_API_KEY` environment variable
6. **Deploy**: One click!

**Result**: Live app at `https://your-app.onrender.com` with:
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ Auto-deploy on git push
- ✅ Built-in monitoring

---

## Next Steps

Once running:

1. ✅ **Test Google**: Quick test to verify
2. ✅ **Test Your Site**: Use dpengeneering.site or any URL
3. ✅ **Review Results**: See AI analysis and recommendations
4. ✅ **Check History**: View past test results
5. ✅ **Automate**: Integrate with CI/CD

---

## Need Help?

- 📖 **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- 🚀 **Render Deploy**: [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
- 📚 **Full Guide**: [QA_TESTER_README.md](QA_TESTER_README.md)
- 🔧 **Troubleshooting**: [USAGE_GUIDE.md](USAGE_GUIDE.md)

---

## Status Check

Run validation to ensure everything is ready:
```bash
cd backend
python test_app_working.py
```

Expected: `8/8 tests passed` ✅

---

**🎉 Ready to Start Testing!**

Choose your method above and get started in 5 minutes!
