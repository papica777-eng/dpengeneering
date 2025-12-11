# 🚀 Deploying Коди AI to Render with dpengeneering.site

This guide will walk you through deploying your AI assistant to Render and connecting your custom domain.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at https://render.com (free)
3. **Gemini API Key** - Get from https://aistudio.google.com/app/apikey
4. **Domain Access** - dpengeneering.site DNS management

---

## 🎯 Part 1: Deploy to Render

### Step 1: Push Code to GitHub

```bash
cd /home/codespace/dpengeneering
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Services

#### A. Deploy Backend (API)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `papica777-eng/dpengeneering`
4. Configure the service:

   **Name:** `kodi-backend`
   
   **Region:** Oregon (US West)
   
   **Branch:** `main`
   
   **Root Directory:** `functions`
   
   **Runtime:** `Node`
   
   **Build Command:**
   ```bash
   npm install
   ```
   
   **Start Command:**
   ```bash
   npm start
   ```
   
   **Plan:** Free

5. **Add Environment Variables:**
   - Click **"Advanced"**
   - Add these environment variables:
     - `GEMINI_API_KEY` = `your_gemini_api_key_here`
     - `NODE_ENV` = `production`
     - `PORT` = `3001`

6. Click **"Create Web Service"**

7. **Save the Backend URL** (e.g., `https://kodi-backend.onrender.com`)

#### B. Deploy Frontend (React App)

1. Click **"New +"** → **"Static Site"**
2. Connect the same repository
3. Configure:

   **Name:** `kodi-frontend`
   
   **Branch:** `main`
   
   **Root Directory:** `client`
   
   **Build Command:**
   ```bash
   npm install && npm run build
   ```
   
   **Publish Directory:**
   ```
   build
   ```

4. **Add Environment Variable:**
   - `REACT_APP_API_URL` = `https://kodi-backend.onrender.com` (use your actual backend URL)

5. Click **"Create Static Site"**

---

## 🌐 Part 2: Connect dpengineering.site Domain

### Step 1: Configure Frontend Domain

1. In Render Dashboard, go to your **kodi-frontend** service
2. Click **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Click **"Add Custom Domain"**
5. Enter: `dpengineering.site`
6. Also add: `www.dpengineering.site`

### Step 2: Get DNS Configuration

Render will show you DNS records to add. You'll see something like:

```
Type: CNAME
Name: dpengineering.site (or @)
Value: kodi-frontend.onrender.com

Type: CNAME
Name: www
Value: kodi-frontend.onrender.com
```

### Step 3: Update Your Domain DNS

Go to your domain registrar (where you bought dpengineering.site) and:

1. **Find DNS Management** (might be called DNS Settings, Nameservers, etc.)

2. **Add CNAME Records:**
   - **For root domain (@):**
     - Type: `CNAME` or `ALIAS`
     - Name: `@` or `dpengineering.site`
     - Value: `kodi-frontend.onrender.com`
     - TTL: `3600` (or Auto)
   
   - **For www subdomain:**
     - Type: `CNAME`
     - Name: `www`
     - Value: `kodi-frontend.onrender.com`
     - TTL: `3600` (or Auto)

3. **Save changes**

### Step 4: Configure Backend API Subdomain (Optional but Recommended)

For better organization, you can also add:

1. In Render, go to **kodi-backend** service
2. Add custom domain: `api.dpengineering.site`
3. Add DNS record at your registrar:
   - Type: `CNAME`
   - Name: `api`
   - Value: `kodi-backend.onrender.com`

4. Then update frontend environment variable:
   - `REACT_APP_API_URL` = `https://api.dpengineering.site`

---

## ⏱️ Part 3: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** (usually 15-30 minutes)
- Check status at: https://www.whatsmydns.net/#CNAME/dpengineering.site
- Render will automatically provision SSL certificates once DNS is verified

---

## ✅ Part 4: Verify Deployment

### Test Backend:
```bash
curl https://kodi-backend.onrender.com/health
# Should return: {"status":"healthy"}
```

Or with your custom domain:
```bash
curl https://api.dpengineering.site/health
```

### Test Frontend:
Visit: `https://dpengineering.site`

You should see the Коди AI Assistant interface!

---

## 🔧 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → kodi-backend → Logs
- Verify `GEMINI_API_KEY` is set correctly
- Check that `PORT` environment variable is set to `3001`

**"Invalid API key"**
- Get a new key from https://aistudio.google.com/app/apikey
- Update environment variable in Render dashboard

### Frontend Issues

**"Failed to get response"**
- Verify `REACT_APP_API_URL` points to correct backend URL
- Check backend is healthy first
- Look at browser console for CORS errors

### Domain Issues

**Domain not working after 1 hour**
- Verify DNS records are correct (use whatsmydns.net)
- Make sure you're using CNAME (not A records)
- Some registrars require ALIAS record for root domain
- Check Render dashboard shows "Certificate issued"

**HTTPS not working**
- Wait for SSL certificate (can take 5-10 minutes after DNS is verified)
- Ensure both HTTP and HTTPS work

---

## 📱 Architecture Overview

```
dpengineering.site (Frontend)
    ↓ (HTTP requests)
api.dpengineering.site (Backend API)
    ↓ (API calls)
Google Gemini AI
    ↓ (stores data)
Firebase Firestore
```

---

## 🔄 Updating Your App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically rebuild and redeploy! 🎉

---

## 💰 Cost Breakdown

- **Render Free Plan:**
  - 750 hours/month free
  - Apps spin down after 15 min inactivity
  - First request may be slow (cold start)
  
- **Domain:** You already own dpengineering.site
- **Gemini API:** Free tier includes generous limits
- **Firebase:** Free Spark plan sufficient for starting

**Total Monthly Cost: $0** (with free tiers)

To eliminate cold starts, upgrade to Render paid plan ($7/month per service).

---

## 🎓 Next Steps

1. **Enable Firebase Authentication** - Add user login
2. **Set up monitoring** - Track API usage and errors
3. **Add analytics** - Google Analytics or similar
4. **Rate limiting** - Prevent API abuse
5. **Backup strategy** - Regular Firestore backups

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Gemini API Docs:** https://ai.google.dev/docs

Need help? Check the logs in Render dashboard first!
