# Коди - AI Programming Assistant with Learning and Memory

An intelligent Firebase Cloud Functions-based AI assistant that learns from every conversation and provides personalized programming guidance.

## 🚀 Features

### Core Capabilities
- **AI-Powered Programming Assistance**: Uses Google's Gemini AI to help with HTML, CSS, JavaScript, and Python
- **Bulgarian Language Support**: Responds in Bulgarian for local users
- **Conversational Memory**: Remembers all past interactions
- **Continuous Learning**: Extracts and tracks programming topics from conversations
- **Personalized Responses**: Tailors answers based on user's learning history
- **Multi-User Support**: Maintains separate learning profiles for each user

### Technical Features
- Firebase Cloud Functions backend
- Firestore database for conversation storage
- Google Generative AI (Gemini) integration
- RESTful API endpoints
- Callable Cloud Functions for client integration
- Automatic topic extraction and categorization
- Session management

## 📦 Installation

### Prerequisites
- Node.js 22.x (note: currently running on Node 20.x with warnings)
- Firebase CLI
- Google Cloud account
- Gemini API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/papica777-eng/dpengeneering.git
   cd dpengeneering
   ```

2. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Configure API Key Securely**
   
   **For Production**:
   ```bash
   firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY_HERE"
   ```
   
   **For Local Development**:
   Create `functions/.runtimeconfig.json`:
   ```json
   {
     "gemini": {
       "apikey": "YOUR_LOCAL_DEVELOPMENT_KEY"
     }
   }
   ```
   
   ⚠️ **IMPORTANT**: Never commit API keys to source code. The `.runtimeconfig.json` file is already in `.gitignore`.
   
   See [REPOSITORY_SECURITY.md](REPOSITORY_SECURITY.md) for detailed security setup.

4. **Deploy to Firebase**
   ```bash
   firebase deploy --only functions
   ```

5. **Deploy Firestore indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

## 🔧 API Functions

### 1. `callKodyAPI` (Callable Function)
Main function for interacting with the AI assistant.

**Parameters:**
```javascript
{
  userId: string,           // User identifier (optional, defaults to 'anonymous')
  sessionId: string,        // Session identifier (optional)
  chatHistory: array,       // Previous messages in the conversation
  userParts: array         // Current user message
}
```

**Returns:**
```javascript
{
  text: string              // AI's response
}
```

**Example:**
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
- **[REPOSITORY_SECURITY.md](REPOSITORY_SECURITY.md)** - Security hardening guide and setup instructions
- **[SECURITY_SUMMARY.md](SECURITY_SUMMARY.md)** - CodeQL security scan results
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre and post-deployment security checklist

## 🧪 Testing

Run basic tests:
```bash
cd functions
node test-learning.js
```

## 🔒 Security

### Current Security Status
- ✅ **API Keys Secured**: No hardcoded secrets in source code
- ✅ **Source Code Protected**: Functions source not deployed to hosting
- ✅ **CodeQL Scanning**: No vulnerabilities found
- ✅ **Data Isolation**: User data separated by `userId`
- ⚠️ **Repository Visibility**: Must be set to Private (see [REPOSITORY_SECURITY.md](REPOSITORY_SECURITY.md))
- ⚠️ **Authentication**: Disabled for development (enable for production)

### Security Implementation
- **API Key Management**: Uses Firebase Functions config (`gemini.apikey`)
- **Environment Variables**: `.runtimeconfig.json` for local development (gitignored)
- **Anonymous Mode**: Available for testing
- **Deployment Security**: Only `public/` folder accessible via hosting

### Production Security Checklist
1. ✅ API keys stored in Firebase Functions config (not in code)
2. ⚠️ Make repository private (see [REPOSITORY_SECURITY.md](REPOSITORY_SECURITY.md))
3. ⚠️ Enable authentication in `callKodyAPI`
4. [ ] Implement rate limiting
5. [ ] Add data retention policies
6. [ ] GDPR compliance measures

**📖 Complete Security Guide**: See [REPOSITORY_SECURITY.md](REPOSITORY_SECURITY.md) for detailed instructions.

## 🛠️ Development

### Local Development
```bash
# Start Firebase emulators
firebase emulators:start

# Test functions locally
curl http://127.0.0.1:5001/kodi-backend/us-central1/systemHealth
```

### Project Structure
```
dpengeneering/
├── functions/
│   ├── index.js              # Main Cloud Functions
│   ├── package.json          # Dependencies
│   └── test-learning.js      # Basic tests
├── public/
│   ├── index.html           # Web interface
│   └── manifest/
├── firestore.indexes.json   # Database indexes
├── firestore.rules          # Security rules
├── firebase.json            # Firebase configuration
├── LEARNING_SYSTEM.md       # Learning system documentation
├── USAGE_EXAMPLES.js        # API usage examples
└── README.md               # This file
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
