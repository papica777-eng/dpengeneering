# ⚡ Quick Reference - Modern Kodi AI

## 🚀 Quick Start

### Local Development
```bash
# Backend
cd functions
node index-render-modern.js

# Frontend
cd client
npm start
```

### Deploy to Production
```bash
git add .
git commit -m "🚀 Modern architecture"
git push origin main
```

---

## 📁 File Reference

| Original File | Modern Version | Purpose |
|--------------|----------------|---------|
| `functions/index.js` | `functions/index.modern.js` | Firebase Functions v2 |
| `functions/index-render.js` | `functions/index-render-modern.js` | Express server with middleware |
| - | `functions/middleware.js` | Security & validation |
| `client/src/App.js` | `client/src/App.modern.jsx` | React with Hooks |
| - | `functions/.env.example` | Safe template |

---

## 🔒 Security Features

### Rate Limiting
```javascript
// Chat: 10 requests/minute
// Health: 60 requests/minute
app.post('/api/chat', apiLimiter, ...)
```

### Input Validation
```javascript
// Max message: 5000 chars
// XSS protection
// User ID sanitization
```

### Security Headers
```javascript
// Content Security Policy
// HSTS
// XSS Filter
// No-sniff
```

---

## 🎯 Key Improvements

| Feature | Before | After |
|---------|--------|-------|
| Security | ⚠️ Basic | ✅ Multi-layer |
| Code Style | 📝 Mixed | ✅ Modern |
| Error Handling | ⚠️ Basic | ✅ Structured |
| Performance | 📊 Good | ✅ Optimized |
| API Protection | ❌ Exposed | ✅ Secured |

---

## 🛠️ Common Tasks

### Check API Key
```bash
grep -r "AIzaSy" --exclude-dir=node_modules .
# Should only show functions/.env
```

### Test Rate Limit
```bash
# Send 11 requests
for i in {1..11}; do curl localhost:5001/api/chat -d '{"data":{"userParts":[{"text":"test"}]}}' & done
```

### View Logs
```bash
# Local
npm start  # See console

# Production
# Render Dashboard → Logs
```

### Check Security Headers
```bash
curl -I https://dpengineering.site
# Look for: Strict-Transport-Security, X-XSS-Protection
```

---

## 📊 Endpoints

### Backend API
- `GET /` - API info
- `GET /health` - Health check
- `POST /api/chat` - Main chat endpoint
- `POST /api/stats` - User learning stats
- `POST /api/history` - Conversation history

### Response Format
```json
{
  "result": { "text": "Response" },
  "sessionId": "session_123"
}
```

### Error Format
```json
{
  "error": "error_code",
  "message": "Human readable",
  "retryAfter": 60
}
```

---

## 🔧 Configuration

### Rate Limits
```javascript
// functions/middleware.js
const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 10
});
```

### CORS Origins
```javascript
const allowedOrigins = [
  'https://dpengineering.site',
  'http://localhost:3000'
];
```

### Message Limits
```javascript
if (message.length > 5000) {
  throw new Error('Too long');
}
```

---

## 🐛 Troubleshooting

### Rate Limited?
- Wait 1 minute
- Check `X-RateLimit-Reset` header
- Contact admin if legitimate traffic

### API Key Error?
```bash
# Check .env exists
cat functions/.env

# Should contain:
# GEMINI_API_KEY=your_key_here
```

### CORS Error?
- Check origin in allowed list
- Verify HTTPS in production
- Check browser console

### Validation Error?
- Check message length (<5000)
- Verify userId format
- Check request structure

---

## 📚 Documentation

- **Security**: `SECURITY_GUIDE.md`
- **Upgrade**: `UPGRADE_GUIDE.md`
- **Summary**: `MODERNIZATION_SUMMARY.md`
- **Reference**: `QUICK_REFERENCE.md` (this file)

---

## ✅ Pre-Deployment Checklist

- [ ] `functions/.env` has real API key
- [ ] `.gitignore` includes `.env`
- [ ] Modern files tested locally
- [ ] No errors in console
- [ ] Rate limiting works
- [ ] Security headers present
- [ ] CORS configured
- [ ] npm audit clean

---

## 🎯 Environment Variables

### Required
```env
GEMINI_API_KEY=your_api_key
FIREBASE_PROJECT_ID=kodi-bot-7
NODE_ENV=production
```

### Optional
```env
PORT=5001
REACT_APP_API_URL=https://your-api.com
```

---

## 🔥 Hot Commands

```bash
# Install dependencies
cd functions && npm install

# Fix security issues
npm audit fix

# Check for secrets
grep -r "AIzaSy" --exclude-dir=node_modules .

# Test locally
node functions/index-render-modern.js

# Deploy
git push origin main

# Check status
curl https://kodi-backend.onrender.com/health
```

---

## 💡 Pro Tips

1. **Always test locally first**
2. **Monitor Render logs after deploy**
3. **Keep `.env` secure**
4. **Review security guide regularly**
5. **Update dependencies monthly**
6. **Check rate limits if errors**
7. **Use development mode locally**
8. **Production uses HTTPS only**

---

**Quick Reference v2.0**  
**Updated:** December 11, 2025
