# Repository Security Hardening Guide

This document provides step-by-step instructions for hardening the security of the dpengineering repository.

## ✅ Completed Actions

### 1. Removed Hardcoded API Keys from Source Code
**Status**: ✅ COMPLETED

The API key has been removed from `functions/index.js` and replaced with environment variable configuration.

**Changes Made**:
- API key now reads from Firebase Functions config: `functions.config().gemini.apikey`
- Falls back to environment variable: `process.env.GEMINI_API_KEY`
- Added error logging if API key is not configured

## 🔐 Required Actions (Must Complete)

### 2. Make Repository Private

**Current Status**: ⚠️ **Repository is PUBLIC** - All source code is visible to everyone

**Action Required**: Make the repository private to restrict access to source code.

**Steps**:
1. Navigate to repository: https://github.com/papica777-eng/dpengeneering
2. Click **Settings** (in the top menu)
3. Scroll down to **Danger Zone** (at the bottom)
4. Click **Change repository visibility**
5. Select **Make private**
6. Type the repository name to confirm
7. Click **I understand, change repository visibility**

**Reference**: [GitHub Documentation - Managing Repository Visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-repository-visibility)

### 3. Configure API Key Securely

**Current Status**: ⚠️ **API Key NOT Configured** - Functions will not work until this is done

**Action Required**: Set the Gemini API key using Firebase Functions config.

#### For Production Deployment:

```bash
# Set the API key in Firebase Functions config
firebase functions:config:set gemini.apikey="YOUR_ACTUAL_GEMINI_API_KEY_HERE"

# Deploy the functions with the new configuration
firebase deploy --only functions
```

#### For Local Development:

Create a `.runtimeconfig.json` file in the `functions/` directory:

```bash
cd functions
cat > .runtimeconfig.json << 'EOF'
{
  "gemini": {
    "apikey": "YOUR_LOCAL_DEVELOPMENT_API_KEY_HERE"
  }
}
EOF
```

**Important**: `.runtimeconfig.json` is already in `.gitignore` and will NOT be committed.

#### Verify Configuration:

```bash
# Check current Firebase Functions config
firebase functions:config:get

# Expected output:
# {
#   "gemini": {
#     "apikey": "YOUR_API_KEY"
#   }
# }
```

### 4. Rotate Exposed Credentials

**Current Status**: ⚠️ **Action Required if Previous Keys Were Real**

If any real API keys were ever committed to this repository (check git history):

1. **Regenerate Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Revoke the old key
   - Generate a new key
   - Configure the new key using the steps above

2. **Check Git History for Exposed Secrets**:
   ```bash
   # Search entire git history for API keys
   git log -p -S "AIza" --all
   git log -p -S "api_key" --all
   ```

3. **If secrets found in history**:
   - Consider using [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-branch`
   - Or create a fresh repository (recommended for small repos)

### 5. Verify Deployment Security

**Current Status**: ✅ **Properly Configured**

The `firebase.json` configuration is secure:

- ✅ Only `public/` folder is deployed to Firebase Hosting
- ✅ `functions/` source code is NOT deployed to hosting
- ✅ Hidden files (`**/.*`) are ignored
- ✅ `node_modules` are ignored
- ✅ `firebase.json` itself is ignored

**What users can access**:
- ✅ https://www.dpengineering.site - Production website
- ✅ Public HTML/CSS/JS files in `public/` folder

**What users CANNOT access**:
- ✅ Source code in `functions/` directory
- ✅ Configuration files (firebase.json, firestore.rules, etc.)
- ✅ Environment variables and secrets
- ✅ Firebase Functions config values

### 6. Enable Production Security Features

**Current Status**: ⚠️ **Authentication Disabled**

The authentication check in `functions/index.js` is currently commented out:

```javascript
// Проверка за сигурност (активирай за продукция)
// if (!context.auth) {
//    throw new functions.https.HttpsError('unauthenticated', 'Моля, влезте в системата.');
// }
```

**Action for Production**:
1. Uncomment the authentication check in `functions/index.js`
2. Implement Firebase Authentication in your web app
3. Test that only authenticated users can access the functions

## 🔍 Security Verification Checklist

Use this checklist to verify all security measures are in place:

- [ ] Repository is set to **Private**
- [ ] API key configured via `firebase functions:config:set gemini.apikey="..."`
- [ ] No hardcoded secrets in source code
- [ ] `.runtimeconfig.json` exists locally but is NOT committed
- [ ] Old API keys rotated if they were exposed
- [ ] Authentication enabled in production
- [ ] Only `public/` folder deployed to Firebase Hosting
- [ ] Test that website works: https://www.dpengineering.site
- [ ] Verify functions work with new API key configuration

## 📋 Testing Instructions

### Test Local Development:

```bash
# 1. Ensure .runtimeconfig.json is configured
cd functions
cat .runtimeconfig.json  # Should show your API key

# 2. Start Firebase emulators
cd ..
firebase emulators:start

# 3. Test the functions
curl http://127.0.0.1:5001/[PROJECT-ID]/us-central1/systemHealth
```

### Test Production Deployment:

```bash
# 1. Deploy functions
firebase deploy --only functions

# 2. Test the deployed functions
# Visit your website and test the chat functionality

# 3. Check logs for any errors
firebase functions:log
```

## 🚨 Emergency Response

If you discover that real API keys were exposed in this repository:

1. **Immediately revoke the exposed key** at https://makersuite.google.com/app/apikey
2. **Generate a new key**
3. **Configure the new key** using `firebase functions:config:set`
4. **Deploy immediately** with `firebase deploy --only functions`
5. **Make repository private** following steps above
6. **Consider cleaning git history** or creating new repository

## 📚 Additional Resources

- [Firebase Functions Configuration](https://firebase.google.com/docs/functions/config-env)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/best-practices-for-securing-your-repository)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

## 📞 Support

If you need help with any of these steps, please:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [GitHub Security Documentation](https://docs.github.com/en/code-security)
3. Open an issue in this repository (after making it private)

---

**Last Updated**: December 2024
**Status**: Security hardening in progress
