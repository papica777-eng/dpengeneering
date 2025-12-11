# 🚀 Quick Start Guide

## Prerequisites
You need a Google Gemini API key to run this app.

### Get Your API Key:
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Set Your API Key:
Edit `functions/.env` and replace `your_api_key_here` with your actual API key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Or set it as an environment variable:
```bash
export GEMINI_API_KEY='your_actual_api_key_here'
```

## Running the App

### Terminal 1 - Start Backend (Firebase Functions):
```bash
./start-backend.sh
```

Or manually:
```bash
cd functions
firebase emulators:start --only functions
```

This will start the Firebase emulator on `http://localhost:5001`

### Terminal 2 - Start Frontend (React App):
```bash
./start-frontend.sh
```

Or manually:
```bash
cd client
npm start
```

This will start the React app on `http://localhost:3000`

## Testing the App

1. Open your browser to `http://localhost:3000`
2. You should see the Коди AI Assistant interface
3. Type a question in Bulgarian or English
4. The AI will respond!

## Troubleshooting

### "Error: Invalid API key"
- Make sure you've set your GEMINI_API_KEY correctly in `functions/.env`
- Verify the key is valid at https://aistudio.google.com/app/apikey

### "Failed to get response"
- Make sure the Firebase emulator is running in Terminal 1
- Check that the emulator is running on port 5001
- Check the emulator terminal for error messages

### Port already in use
If port 3000 or 5001 is already in use:
- For React: The app will prompt you to use a different port (press Y)
- For Firebase: Stop other Firebase emulator instances

## Project Structure

```
dpengeneering/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   └── App.css     # Styles
│   └── package.json
├── functions/           # Firebase Cloud Functions
│   ├── index.js        # Main backend code
│   ├── .env            # API key configuration
│   └── package.json
└── firebase.json        # Firebase configuration
```

## Features

- 🤖 AI-powered programming assistance
- 💬 Conversational interface in Bulgarian
- 📚 Learning system that remembers past conversations
- 🔒 User-specific learning profiles
- 📊 Firestore database for conversation storage

## Next Steps

- Deploy to Firebase: `firebase deploy`
- Add authentication
- Customize the AI's personality in `functions/index.js`
- Add more programming languages support
