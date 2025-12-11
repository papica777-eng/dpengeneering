# Sessions Page Setup Instructions

## Overview
The Sessions page has been implemented to display user learning statistics and conversation history with the Kodi AI assistant.

## Firebase Configuration Required

Before the Sessions page can work properly, you need to configure Firebase credentials in `/public/index.html`.

### Steps to Configure:

1. **Get Firebase Configuration**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `kodi-bot-7`
   - Click on Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Copy the Firebase configuration object

2. **Update index.html**
   - Open `/public/index.html`
   - Find the Firebase configuration section (around line 1568)
   - Replace the placeholder values:
     ```javascript
     const firebaseConfig = {
         apiKey: "YOUR_ACTUAL_API_KEY_HERE",
         authDomain: "kodi-bot-7.firebaseapp.com",
         projectId: "kodi-bot-7",
         storageBucket: "kodi-bot-7.appspot.com",
         messagingSenderId: "YOUR_ACTUAL_SENDER_ID_HERE",
         appId: "YOUR_ACTUAL_APP_ID_HERE"
     };
     ```

3. **Deploy the Functions**
   Ensure the following Firebase Cloud Functions are deployed:
   - `getUserLearningStats` - Returns user learning profile
   - `getConversationHistory` - Returns recent conversations

   To deploy:
   ```bash
   firebase deploy --only functions:getUserLearningStats,getConversationHistory
   ```

## Features

### Learning Statistics
- Total interaction count
- First interaction timestamp
- Last interaction timestamp
- Topics learned (displayed as tags)

### Conversation History
- Last 10 conversations
- Session IDs and timestamps
- Expandable conversation details
- User messages and AI responses

## Usage

1. Navigate to the Sessions page using the navigation menu
2. Enter your User ID (defaults to 'anonymous')
3. The page will automatically load your data
4. Use the "Refresh Sessions Data" button to reload

## Troubleshooting

### "Failed to load learning statistics"
- Check that Firebase credentials are correctly configured
- Verify that the `getUserLearningStats` function is deployed
- Check browser console for detailed error messages

### "Failed to load conversations"
- Ensure the `getConversationHistory` function is deployed
- Verify the user ID exists in the database
- Check Firestore rules allow reading from the `conversations` collection

### "No conversations found"
- This is normal if the user hasn't interacted with Kodi yet
- Try using the AI assistant first to create conversations

## Testing

You can test the Sessions page using Firebase Emulators:

```bash
# Start emulators
firebase emulators:start

# Access the app
# Open browser to http://localhost:5000
# Navigate to Sessions page
```

## API Reference

### getUserLearningStats(data)
**Parameters:**
- `userId` (string): User identifier

**Returns:**
```javascript
{
  topics: string[],
  preferences: object,
  firstInteraction: Timestamp,
  lastInteraction: Timestamp,
  interactionCount: number
}
```

### getConversationHistory(data)
**Parameters:**
- `userId` (string): User identifier
- `limit` (number): Max conversations to return (default: 10)

**Returns:**
```javascript
{
  conversations: [
    {
      id: string,
      userId: string,
      sessionId: string,
      timestamp: Timestamp,
      userMessage: string,
      aiResponse: string,
      chatHistory: array
    }
  ]
}
```
