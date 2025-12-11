# Коди AI Assistant - Render Deployment Files

This directory contains all the configuration files needed to deploy your Коди AI Assistant to Render with your custom domain dpengineering.site.

## 📁 Files Created

### Configuration Files
- **`render.yaml`** - Render service configuration (optional, for Blueprint deployment)
- **`functions/index-render.js`** - Express server for Render deployment
- **`.env.production.example`** - Template for production environment variables

### Build Scripts
- **`build-backend.sh`** - Backend build script for Render
- **`build-frontend.sh`** - Frontend build script for Render
- **`start-backend.sh`** - Local backend start script with API key validation
- **`start-frontend.sh`** - Local frontend start script

### Documentation
- **`RENDER_DEPLOYMENT.md`** - Complete deployment guide with DNS setup
- **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step checklist
- **`QUICKSTART.md`** - Quick start guide for local development

### Updated Files
- **`client/src/App.js`** - Now supports both development and production API URLs
- **`client/src/config.js`** - Configuration management (NEW)
- **`functions/package.json`** - Added express, cors dependencies and start script
- **`functions/index.js`** - Configured to use environment variables
- **`.gitignore`** - Updated to exclude .env files

## 🚀 Quick Start

### 1. Local Development
```bash
# Terminal 1 - Backend
export GEMINI_API_KEY='your_key_here'
./start-backend.sh

# Terminal 2 - Frontend
./start-frontend.sh
```

### 2. Deploy to Render

Follow the detailed guide in **`RENDER_DEPLOYMENT.md`**

Or use the checklist in **`DEPLOYMENT_CHECKLIST.md`**

## 🌐 Domain Setup

Your domain: **dpengineering.site**

### DNS Records to Add:
```
Type: CNAME
Name: @ (or dpengineering.site)
Value: kodi-frontend.onrender.com

Type: CNAME
Name: www
Value: kodi-frontend.onrender.com

Type: CNAME (optional, recommended)
Name: api
Value: kodi-backend.onrender.com
```

## 🔑 Environment Variables

### Backend (Render Dashboard)
```
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=3001
```

### Frontend (Render Dashboard)
```
REACT_APP_API_URL=https://kodi-backend.onrender.com
# Or with custom domain:
REACT_APP_API_URL=https://api.dpengineering.site
```

## 📊 Architecture

```
User → dpengineering.site (React Frontend on Render Static Site)
           ↓
      api.dpengineering.site (Express Backend on Render Web Service)
           ↓
      Google Gemini AI
           ↓
      Firebase Firestore (User data & conversations)
```

## ✅ Deployment Verification

1. **Backend Health Check:**
   ```bash
   curl https://kodi-backend.onrender.com/health
   # or
   curl https://api.dpengineering.site/health
   ```

2. **Frontend:**
   - Visit https://dpengineering.site
   - Should load the AI chat interface

3. **Full Test:**
   - Type a message in the chat
   - Should get AI response in Bulgarian

## 🔧 Troubleshooting

See **`RENDER_DEPLOYMENT.md`** section "Troubleshooting" for common issues and solutions.

## 📝 Notes

- Free Render services sleep after 15 minutes of inactivity
- First request after sleep will be slower (cold start ~30 seconds)
- DNS propagation can take 15 minutes to 48 hours
- SSL certificates are automatically provisioned by Render

## 🎉 Success!

Once deployed, your AI assistant will be live at:
- **Main site:** https://dpengineering.site
- **With www:** https://www.dpengineering.site
- **API:** https://api.dpengineering.site (if configured)

Happy coding! 🤖
