# Deploy to Render - Step by Step Guide

This guide will help you deploy the QA Tester backend to Render.com in minutes.

## Why Render?

- ✅ **Free Tier Available** - Start testing for free
- ✅ **Automatic Deployments** - Deploy from Git
- ✅ **HTTPS by Default** - Secure out of the box
- ✅ **Easy Environment Variables** - Simple config
- ✅ **No Credit Card Required** - For free tier

## Prerequisites

1. A GitHub account
2. A Render account ([Sign up free](https://render.com))
3. A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Deployment Steps

### Step 1: Fork the Repository

1. Go to https://github.com/papica777-eng/dpengeneering
2. Click the "Fork" button in the top right
3. Wait for the fork to complete

### Step 2: Get Your Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with "AIza...")
5. Keep it safe - you'll need it in Step 5

### Step 3: Create Render Account

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 4: Create New Web Service

1. From Render Dashboard, click "New +"
2. Select "Web Service"
3. Click "Connect" next to your forked repository
4. If you don't see it, click "Configure account" to grant access

### Step 5: Configure Your Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `dpengineering-qa-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main` (or your branch name)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && playwright install chromium --with-deps
  ```

- **Start Command**: 
  ```bash
  python app.py
  ```

**Plan:**
- Select **Free** (or upgrade later if needed)

### Step 6: Add Environment Variables

Still in the configuration page, scroll to "Environment Variables":

1. Click "Add Environment Variable"
2. Add the following:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Gemini API key from Step 2 |
| `FLASK_ENV` | `production` |
| `PORT` | `5000` |

**Important**: Keep your API key secure! Don't share it publicly.

### Step 7: Deploy!

1. Scroll to the bottom
2. Click "Create Web Service"
3. Wait for deployment (first deploy takes 5-10 minutes)
4. Watch the logs for any errors

### Step 8: Verify Deployment

Once deployed, you'll see:
- ✅ "Live" badge in green
- Your service URL: `https://your-app-name.onrender.com`

Test it:
```bash
curl https://your-app-name.onrender.com/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "QA Tester Backend is running",
  "timestamp": "2024-12-11T..."
}
```

## Step 9: Update Frontend

Update your frontend to use the Render backend:

1. Open `public/index.html`
2. Find the backend URL setting (around line 2475)
3. Change it to your Render URL:
   ```javascript
   const backendUrl = 'https://your-app-name.onrender.com/api';
   ```

## Using Your Deployed App

### Web Interface

1. Open `public/index.html` in your browser
2. Or deploy the frontend to:
   - GitHub Pages
   - Netlify
   - Vercel
   - Any static hosting

### API Access

```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Run a test
curl -X POST https://your-app-name.onrender.com/api/qa_project \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "My Site Test",
    "target_url": "https://example.com",
    "selected_goals": {
      "Browser Navigation & URL Validation": true,
      "Performance Metrics & Load Times": true
    }
  }'

# Get history
curl https://your-app-name.onrender.com/api/qa_history
```

## Troubleshooting

### Deployment Failed

**Check Build Logs:**
- Click on your service
- Go to "Logs" tab
- Look for red error messages

**Common Issues:**

1. **"GEMINI_API_KEY not found"**
   - Solution: Add the environment variable in Render dashboard
   - Go to Environment tab → Add variable

2. **"Playwright install failed"**
   - Solution: Render's free tier should support this
   - Check if build command is correct
   - Try: `playwright install chromium --with-deps`

3. **"Port already in use"**
   - Solution: Make sure PORT env var is set to 5000
   - Render automatically binds to the PORT variable

4. **"Service keeps restarting"**
   - Check logs for Python errors
   - Verify all dependencies are in requirements.txt
   - Make sure app.py listens on 0.0.0.0

### API Returns Errors

**"GEMINI_API_KEY environment variable is required"**
- Add your API key in Render Environment Variables
- Redeploy the service

**"Connection timeout"**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Subsequent requests are fast

**CORS errors**
- Backend already configured for CORS
- If still seeing issues, check browser console
- Verify frontend is using correct backend URL

## Render Free Tier Limits

What you get for free:
- ✅ 750 hours/month of running time
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Environment variables
- ⚠️ Service sleeps after 15 min inactivity
- ⚠️ 512 MB RAM (sufficient for QA Tester)

Tips for free tier:
1. Service sleeps when idle - first request wakes it (30s delay)
2. Use it regularly to keep it awake
3. Upgrade to paid tier for 24/7 availability

## Monitoring

### View Logs

1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. See real-time logs

### View Metrics

1. Click "Metrics" tab
2. See:
   - Request count
   - Response times
   - Memory usage
   - CPU usage

### Set Up Alerts

1. Click "Settings"
2. Scroll to "Notifications"
3. Add email for:
   - Deploy failures
   - Service downtime
   - High error rates

## Updating Your App

### Automatic Deploys

When you push to GitHub:
1. Render detects the push
2. Automatically rebuilds
3. Deploys new version
4. Zero downtime deployment

### Manual Deploy

1. Go to Render Dashboard
2. Click your service
3. Click "Manual Deploy"
4. Select branch
5. Click "Deploy"

## Custom Domain

Want to use your own domain? (e.g., api.dpengineering.site)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as shown
5. Wait for verification
6. HTTPS automatically configured!

## Costs

### Free Tier
- **Cost**: $0/month
- **Limits**: 750 hours, sleeps when idle
- **Best for**: Testing, demos, personal projects

### Starter Tier ($7/month)
- **Features**: Always on, more RAM
- **Best for**: Production use
- **Upgrade anytime**: From Render dashboard

## Security Best Practices

1. **Never commit API keys** ✅ (Already configured)
2. **Use environment variables** ✅ (Already configured)
3. **Enable HTTPS** ✅ (Automatic on Render)
4. **Monitor logs regularly** ← Do this!
5. **Rotate API keys periodically** ← Do this every 90 days

## Next Steps

After deployment:

1. ✅ Test the health endpoint
2. ✅ Run a test through the API
3. ✅ Update frontend to use new backend URL
4. ✅ Set up monitoring/alerts
5. ✅ Add custom domain (optional)
6. ✅ Share with your team!

## Getting Help

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Support: support@render.com

**QA Tester Issues:**
- GitHub Issues: https://github.com/papica777-eng/dpengeneering/issues
- Check logs first
- Include error messages

## Success!

🎉 Your QA Tester is now live at:
`https://your-app-name.onrender.com`

Start testing your websites with AI-powered automation!

---

**Quick Reference:**

```bash
# Backend URL
https://your-app-name.onrender.com

# Health Check
https://your-app-name.onrender.com/api/health

# Test Endpoint
POST https://your-app-name.onrender.com/api/qa_project

# History
GET https://your-app-name.onrender.com/api/qa_history
```

Happy Testing! 🚀
