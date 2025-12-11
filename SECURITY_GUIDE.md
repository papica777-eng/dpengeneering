# 🔒 Security Configuration

This document outlines the security measures implemented in the Коди AI Assistant project.

## 🛡️ Security Checklist

### ✅ Implemented Security Measures

- [x] **API Keys Protected**: All API keys stored in `.env` files (gitignored)
- [x] **Environment Variables**: Sensitive data never hardcoded
- [x] **Git Ignore**: Comprehensive `.gitignore` for secrets
- [x] **HTTPS Only**: All production traffic encrypted
- [x] **CORS Configuration**: Restricted origins in production
- [x] **Input Validation**: User inputs sanitized
- [x] **Error Handling**: No sensitive data in error messages
- [x] **Rate Limiting**: Firebase built-in quotas
- [x] **Firestore Rules**: Database access controls

### 🔐 API Key Management

**Never commit these files:**
```
functions/.env
functions/.env.local
client/.env
client/.env.local
*.key
*.pem
secrets/
```

**How to set up:**
```bash
# 1. Copy example file
cp functions/.env.example functions/.env

# 2. Add your API key
echo "GEMINI_API_KEY=your_actual_key_here" > functions/.env

# 3. Verify it's gitignored
git status # should NOT show .env files
```

### 🚨 If API Key Was Exposed

**Immediate Actions:**
1. **Revoke the old key immediately** at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Generate a new key**
3. **Update `.env` file** with new key
4. **Check git history:**
   ```bash
   git log --all --full-history --source -- "*/.env"
   ```
5. **If found in history, use BFG Repo-Cleaner:**
   ```bash
   # Install BFG
   brew install bfg # or download from rtyley.github.io/bfg-repo-cleaner
   
   # Remove sensitive data
   bfg --replace-text secrets.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

### 🔒 Firebase Security Rules

**Firestore Rules (firestore.rules):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User learning profiles - user can only read/write their own
    match /user_learning/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Conversations - user can only read their own
    match /conversations/{conversationId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

### 🌐 CORS Configuration

**Production CORS settings:**
```javascript
// Only allow requests from your domain
const corsOptions = {
  origin: 'https://dpengineering.site',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 🔍 Input Validation

All user inputs are validated before processing:
```javascript
// Validate userId
if (!userId || typeof userId !== 'string') {
  throw new HttpsError('invalid-argument', 'Invalid userId');
}

// Validate message length
if (message.length > 5000) {
  throw new HttpsError('invalid-argument', 'Message too long');
}

// Sanitize HTML
const sanitized = DOMPurify.sanitize(userInput);
```

### 📊 Rate Limiting

**Firebase Functions Quotas:**
- 125,000 invocations/day (free tier)
- Automatic throttling
- Per-user rate limits in production

**Custom rate limiting:**
```javascript
// Track requests per user
const userRequests = new Map();
const RATE_LIMIT = 60; // requests per minute

function checkRateLimit(userId) {
  const now = Date.now();
  const userHistory = userRequests.get(userId) || [];
  const recentRequests = userHistory.filter(t => now - t < 60000);
  
  if (recentRequests.length >= RATE_LIMIT) {
    throw new HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  
  userRequests.set(userId, [...recentRequests, now]);
}
```

### 🚫 What NOT to Do

❌ **Never commit:**
- API keys
- Database credentials
- Private keys
- `.env` files
- Secrets or passwords

❌ **Never expose in code:**
- Hardcoded API keys
- Database connection strings
- User personal data in logs

❌ **Never share:**
- Your `.env` file
- Firebase service account keys
- Production credentials

### ✅ Best Practices

✓ **Use environment variables** for all secrets  
✓ **Keep `.gitignore` updated**  
✓ **Rotate API keys** regularly  
✓ **Monitor API usage** in dashboards  
✓ **Enable 2FA** on all accounts  
✓ **Review Firestore rules** regularly  
✓ **Use HTTPS** everywhere  
✓ **Validate all inputs**  
✓ **Log security events**  
✓ **Keep dependencies updated**  

### 📞 Report Security Issues

If you discover a security vulnerability:
1. **Do NOT** open a public issue
2. Email: [your-email]
3. Include detailed description
4. Allow time for fix before disclosure

---

## 🔐 Production Deployment Security

### Render Environment Variables

Set these in Render Dashboard (never commit):
```
GEMINI_API_KEY=your_production_key
NODE_ENV=production
FIREBASE_PROJECT_ID=kodi-bot-7
```

### SSL/TLS

- ✅ Automatic HTTPS on Render
- ✅ Force HTTPS in production
- ✅ Valid SSL certificate
- ✅ HSTS headers enabled

### Monitoring

- Firebase Console: Monitor API usage
- Render Dashboard: Check logs for anomalies
- Set up alerts for:
  - High API usage
  - Error rate spikes
  - Unusual traffic patterns

---

**Last Updated:** December 11, 2025  
**Security Version:** 2.0
