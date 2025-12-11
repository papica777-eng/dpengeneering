# 🤖 Коди - AI Programming Assistant

<div align="center">

![Status](https://img.shields.io/badge/Status-Live-success)
![Node](https://img.shields.io/badge/Node.js-22.x-green)
![React](https://img.shields.io/badge/React-19.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-Cloud%20Functions-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-purple)

**An intelligent AI programming assistant with conversation memory and personalized learning**

[Live Demo](https://dpengineering.site) · [Portfolio Details](PORTFOLIO.md) · [Deploy Guide](RENDER_DEPLOYMENT.md)

</div>

---

## 💼 Portfolio Project

This is a **full-stack AI application** demonstrating modern web development practices, cloud architecture, and AI integration. 

**🎯 View Complete Portfolio Breakdown:** [PORTFOLIO.md](PORTFOLIO.md)

### Project Highlights

- ✅ **Full-Stack Development** - React frontend + Node.js backend
- ✅ **AI Integration** - Google Gemini API with context management  
- ✅ **Cloud Architecture** - Firebase Functions + Firestore database
- ✅ **Production Deployed** - Live at [dpengineering.site](https://dpengineering.site)
- ✅ **Comprehensive Docs** - 10+ guides covering all aspects
- ✅ **Zero Cost** - Deployed using free tiers

---

## 📋 Project Overview

**Коди** is an intelligent AI programming assistant that provides personalized coding help in Bulgarian. It features conversation memory, topic tracking, and adaptive learning capabilities.

### ✨ Core Features

- 🧠 **Intelligent Learning** - Tracks topics and adapts responses
- 💬 **Conversational Memory** - Remembers all past interactions  
- 📊 **User Profiles** - Individual learning profiles per user
- 🔥 **Scalable Backend** - Firebase Cloud Functions + Firestore
- ⚡ **Real-time AI** - Fast responses using Google Gemini
- 🌐 **Production Ready** - Deployed with custom domain & SSL

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Firebase CLI: `npm install -g firebase-tools`
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### One-Command Start

```bash
# Install all dependencies
npm run install:all

# Set your API key
echo "GEMINI_API_KEY=your_api_key_here" > functions/.env

# Start everything
npm start
   cd ..
   ```

4. **Configure API Key**
   Edit `functions/index.js` and replace the API key:
   ```javascript
   const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
   ```

5. **Build the React frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

6. **Deploy to Firebase**
   ```bash
   firebase deploy --only functions,hosting
   ```

7. **Deploy Firestore indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

## 📚 Architecture & Design

### System Architecture

```
┌─────────────────────────────────┐
│   React Frontend (Client)       │
│   - Conversational UI            │
│   - State Management             │
│   - API Integration              │
└────────────┬────────────────────┘
             │ HTTPS
             ↓
┌─────────────────────────────────┐
│   Firebase Cloud Functions       │
│   - callKodyAPI                  │
│   - Learning System              │
│   - Topic Extraction             │
└────────────┬────────────────────┘
             │ API Calls
             ↓
┌─────────────────────────────────┐
│   Google Gemini AI               │
│   - Natural Language Processing  │
│   - Context-Aware Responses      │
└──────────────────────────────────┘
             │ Store Data
             ↓
┌─────────────────────────────────┐
│   Firebase Firestore             │
│   - Conversations                │
│   - User Learning Profiles       │
│   - Topic Tracking               │
└──────────────────────────────────┘
```

### Key Features Implementation

**1. Learning System:**
- Automatically extracts programming topics from conversations
- Maintains user-specific learning profiles
- Provides context-aware responses based on history

**2. Conversation Memory:**
- Stores all interactions in Firestore
- Session-based tracking
- Historical context integration

**3. Multi-Language Support:**
- Primary: Bulgarian
- System prompts optimized for local users
- Context-aware language handling

---

## 🔧 API Documentation

### Core Endpoints

#### `callKodyAPI` - Main AI Function
**Method:** HTTP POST (Callable Function)

**Request:**
```javascript
{
  userId: string,        // User identifier
  sessionId: string,     // Session ID
  chatHistory: array,    // Previous messages
  userParts: array       // Current message
}
```

**Response:**
```javascript
{
  text: string          // AI-generated response
}
```

**Example Usage:**
```javascript
const result = await firebase.functions().httpsCallable('callKodyAPI')({
    userId: 'user123',
    chatHistory: [],
    userParts: ['Как да създам функция в JavaScript?']
});
console.log(result.data.text);
```

### 2. `getUserLearningStats` (Callable Function)
Retrieve learning statistics for a user.

**Parameters:**
```javascript
{
  userId: string            // User identifier
}
```

**Returns:**
```javascript
{
  topics: array,            // List of topics discussed
  preferences: object,      // User preferences
  firstInteraction: timestamp,
  lastInteraction: timestamp,
  interactionCount: number
}
```

### 3. `getConversationHistory` (Callable Function)
Get past conversations for a user.

**Parameters:**
```javascript
{
  userId: string,           // User identifier
  limit: number            // Maximum number of conversations (default: 10)
}
```

**Returns:**
```javascript
{
  conversations: array      // Array of conversation objects
}
```

### 4. `systemHealth` (HTTP Function)
Check system health and database connectivity.

**Endpoint:** `GET /systemHealth`

**Returns:**
```javascript
{
  status: string,           // 'OK' or 'ERROR'
  checks: {
    server: { status: string, message: string },
    database: { status: string, message: string }
  }
}
```

### 5. `greetUserDB` (HTTP Function)
Test database with a greeting function.

**Endpoint:** `GET /greetUserDB?name=<username>`

## 🗄️ Database Schema

### Collection: `conversations`
Stores all user-AI conversations.

```javascript
{
  userId: string,
  sessionId: string,
  timestamp: Timestamp,
  userMessage: string,
  aiResponse: string,
  chatHistory: array
}
```

**Index:** `userId` (ASC) + `timestamp` (DESC)

### Collection: `user_learning`
Stores user learning profiles.

```javascript
{
  topics: array,            // e.g., ['HTML', 'CSS', 'JavaScript']
  preferences: object,
  firstInteraction: Timestamp,
  lastInteraction: Timestamp,
  interactionCount: number
}
```

### Collection: `users`
Tracks user visits (from greetUserDB function).

```javascript
{
  firstVisit: Date
}
```

## 🎯 How Learning Works

1. **User sends a message** → System retrieves their learning profile
2. **AI generates response** → Enhanced with context from past interactions
3. **Conversation is saved** → Stored in Firestore for future reference
4. **Topics are extracted** → Automatically identified from the conversation
5. **Profile is updated** → New topics and interaction count saved

### Topic Extraction
The system tracks 20+ programming keywords:
- **Languages**: HTML, CSS, JavaScript, Python
- **Bulgarian terms**: функция, клас, променлива, масив, обект, цикъл, условие
- **English terms**: function, class, array, loop, variable
- **Technologies**: Firebase, база данни, API

## 📚 Documentation

- **[LEARNING_SYSTEM.md](LEARNING_SYSTEM.md)** - Comprehensive documentation of the learning system
- **[USAGE_EXAMPLES.js](USAGE_EXAMPLES.js)** - Code examples for all API functions

## 🧪 Testing

Run basic tests:
```bash
cd functions
node test-learning.js
```

## 🔒 Security

- CodeQL security scanning: ✅ No vulnerabilities found
- User data is isolated by `userId`
- Anonymous mode available
- API key should be stored securely (use environment variables in production)

### Production Recommendations
1. Enable authentication check in `callKodyAPI`:
   ```javascript
   if (!context.auth) {
       throw new functions.https.HttpsError('unauthenticated', 'Please log in.');
   }
   ```
2. Store API key in environment variables
3. Implement rate limiting
4. Add data retention policies
5. Comply with data protection regulations (GDPR, etc.)

## 🛠️ Development


**Frontend Development:**
```bash
# Start React development server
cd client
npm start
```

**Backend Development:**
```bash
# Start Firebase emulators
firebase emulators:start

# Test functions locally
curl http://127.0.0.1:5001/kodi-backend/us-central1/systemHealth
```

### Project Structure
```
dpengineering/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles
│   │   └── index.js        # Entry point
│   ├── public/             # Static assets
│   ├── build/              # Production build (generated)
│   └── package.json        # Frontend dependencies
├── functions/              # Firebase Backend
│   ├── index.js           # Main Cloud Functions
│   ├── package.json       # Backend dependencies
│   └── test-learning.js   # Basic tests
├── public/                # Legacy static HTML (preserved)
│   ├── index.html        # Original web interface
│   └── manifest/
├── firestore.indexes.json # Database indexes
├── firestore.rules        # Security rules
├── firebase.json          # Firebase configuration
├── LEARNING_SYSTEM.md     # Learning system documentation
├── USAGE_EXAMPLES.js      # API usage examples
└── README.md             # This file
```

## 📈 Future Enhancements

- [ ] Sentiment analysis for user satisfaction tracking
- [ ] Difficulty level adaptation
- [ ] Personalized learning paths
- [ ] Quiz generation based on discussed topics
- [ ] Progress visualization dashboard
- [ ] Multi-language support expansion
- [ ] Advanced preference learning (learning style, explanation depth)
- [ ] Integration with code execution environments
- [ ] Voice interface support

## 👥 Contributing

Created by Камелия (Kamelia)  
Maintained by the dpengineering team

## 📄 License

This project is private.

## 🙏 Acknowledgments

- Google Generative AI (Gemini) for AI capabilities
- Firebase for backend infrastructure
- The open-source community for various dependencies

## 📞 Support

For issues and questions, please open an issue in the GitHub repository.

---

**Note**: This AI assistant is designed for educational purposes to help beginners learn programming. Always verify code suggestions and follow best practices.
