# 🔑 API Key Setup Guide

## Quick Setup (Recommended)

Run the interactive setup script:

```bash
./SETUP_API_KEY.sh
```

This will:
1. Guide you through getting an API key
2. Securely save it to `backend/.env` file
3. Prepare your environment to run the app

Then start the app:
```bash
./START.sh
```

## Manual Setup

### Step 1: Get Your API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your key (starts with `AIza...`)

### Step 2: Configure the Key

Choose one method:

#### Method A: Environment Variable (Temporary - Current Session)

```bash
export GEMINI_API_KEY='your-api-key-here'
./START.sh
```

#### Method B: .env File (Recommended - Persistent)

Create `backend/.env` file:
```bash
echo "GEMINI_API_KEY=your-api-key-here" > backend/.env
./START.sh
```

The `.env` file is automatically loaded and is in `.gitignore` (won't be committed).

#### Method C: System Environment (Permanent)

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
export GEMINI_API_KEY='your-api-key-here'
```

Then reload:
```bash
source ~/.bashrc  # or ~/.zshrc
./START.sh
```

## Security Notes

⚠️ **IMPORTANT**: Never commit your API key to Git!

✅ **Safe practices**:
- Use `.env` file (already in `.gitignore`)
- Use environment variables
- Use secret management tools (for production)

❌ **Unsafe practices**:
- Don't hardcode keys in source code
- Don't post keys in comments or issues
- Don't commit `.env` files

## Verify Setup

Check if your API key is configured:

```bash
./START.sh --demo
```

This shows your setup status without starting the server.

## Troubleshooting

### "GEMINI_API_KEY is not configured"

**Solution**: Run the setup script
```bash
./SETUP_API_KEY.sh
```

### "API key doesn't work"

**Check**:
1. Key format starts with `AIza`
2. No extra spaces or quotes
3. Key is active in Google AI Studio

**Test**:
```bash
# Check if set
echo $GEMINI_API_KEY

# Check .env file
cat backend/.env
```

### "Want to change API key"

**Update .env file**:
```bash
./SETUP_API_KEY.sh
# Choose option 1 and enter new key
```

Or edit directly:
```bash
nano backend/.env
# Update GEMINI_API_KEY value
```

## For Production (Render)

When deploying to Render:

1. Don't include `.env` file
2. Set environment variable in Render dashboard:
   - Go to Environment tab
   - Add: `GEMINI_API_KEY` = your-key
   - Redeploy

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for details.

## API Key Info

**What is it?**
- Free API key from Google for Gemini AI
- Required for AI-powered bug detection

**Get one at**:
- https://makersuite.google.com/app/apikey

**Cost**:
- Free tier available
- See Google AI Studio for limits

## Need Help?

Run the demo mode to see what's needed:
```bash
./START.sh --demo
```

Or check other guides:
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup
- [START_APP.md](START_APP.md) - Complete startup guide
- [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Cloud deployment

---

**Quick Commands**:

```bash
# Interactive setup
./SETUP_API_KEY.sh

# Start with .env file
./START.sh

# Check status
./START.sh --demo

# Manual export
export GEMINI_API_KEY='your-key'
```
