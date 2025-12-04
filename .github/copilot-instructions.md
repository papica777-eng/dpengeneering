# GitHub Copilot Instructions

## Project Overview
This repository contains "Коди" (Kodi) - an AI Programming Assistant with Learning and Memory. It's a Firebase Cloud Functions-based intelligent assistant that helps beginners learn programming (HTML, CSS, JavaScript, Python) in Bulgarian language. The system maintains conversation memory and continuously learns from user interactions to provide personalized guidance.

## Tech Stack
- **Backend**: Firebase Cloud Functions (Node.js 22.x)
- **Database**: Cloud Firestore
- **AI**: Google Generative AI (Gemini 1.5 Flash)
- **Hosting**: Firebase Hosting
- **Dependencies**:
  - `@google/generative-ai`: ^0.24.1
  - `firebase-admin`: ^12.6.0
  - `firebase-functions`: ^6.0.1
  - `firebase-functions-test`: ^3.1.0 (dev)

## Project Structure
```
dpengineering/
├── .github/                    # GitHub configuration
├── functions/                  # Firebase Cloud Functions
│   ├── index.js               # Main Cloud Functions code
│   ├── package.json           # Node.js dependencies
│   ├── test-learning.js       # Basic test scripts
│   └── .gitignore            # Functions-specific gitignore
├── public/                    # Firebase Hosting files
│   ├── index.html            # Web interface
│   └── manifest/             # Web manifest files
├── firebase.json              # Firebase configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore indexes
├── storage.rules             # Cloud Storage security rules
├── database.rules.json       # Realtime Database rules
├── README.md                 # Project documentation
├── LEARNING_SYSTEM.md        # Learning system documentation
├── USAGE_EXAMPLES.js         # API usage examples
└── SECURITY_SUMMARY.md       # Security audit results
```

## Key Features
1. **AI-Powered Programming Assistance**: Uses Gemini AI for natural language interactions
2. **Bulgarian Language Support**: All responses are in Bulgarian
3. **Conversational Memory**: Stores and retrieves past conversations
4. **Continuous Learning**: Automatically extracts and tracks programming topics
5. **Multi-User Support**: Maintains separate learning profiles per user
6. **Personalized Responses**: Tailors answers based on learning history

## Cloud Functions API

### Main Functions
1. **`callKodyAPI`** (Callable): Main AI interaction endpoint
   - Input: `{ userId, sessionId, chatHistory, userParts }`
   - Output: `{ text }`
   
2. **`getUserLearningStats`** (Callable): Get user's learning statistics
   - Input: `{ userId }`
   - Output: `{ topics, preferences, firstInteraction, lastInteraction, interactionCount }`

3. **`getConversationHistory`** (Callable): Retrieve past conversations
   - Input: `{ userId, limit }`
   - Output: `{ conversations }`

4. **`systemHealth`** (HTTP): Health check endpoint
   - Endpoint: `GET /systemHealth`

5. **`greetUserDB`** (HTTP): Database test function
   - Endpoint: `GET /greetUserDB?name=<username>`

## Firestore Collections
- **`conversations`**: Stores all user-AI conversations
  - Index: `userId` (ASC) + `timestamp` (DESC)
- **`user_learning`**: Stores user learning profiles and topics
- **`users`**: Tracks user visits

## Development Commands

### Setup
```bash
# Install dependencies
cd functions
npm install

# Start Firebase emulators for local development
firebase emulators:start
```

### Testing
```bash
# Run basic learning system tests
cd functions
node test-learning.js

# Test health endpoint locally
curl http://127.0.0.1:5001/kodi-backend/us-central1/systemHealth
```

### Deployment
```bash
# Deploy all functions
firebase deploy --only functions

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy hosting
firebase deploy --only hosting

# Deploy all
firebase deploy
```

### Emulator Ports
- Auth: 5001
- Functions: 5001
- Firestore: 8080
- Database: 9001
- Hosting: 5000
- Storage: 9199

## Code Conventions

### Language
- **User-facing text**: Bulgarian (Cyrillic)
- **Code comments**: Bulgarian for user-facing logic, English acceptable for technical details
- **Variable/function names**: English (camelCase)

### JavaScript Style
- Use `const` and `let` (avoid `var`)
- Use async/await for asynchronous operations
- Proper error handling with try-catch blocks
- Use template literals for string interpolation
- Follow existing code formatting

### Firebase Conventions
- Use `admin.firestore.FieldValue.serverTimestamp()` for timestamps
- Always initialize admin only if not already initialized
- Use callable functions for authenticated operations
- Use HTTP functions for public endpoints

### Security
- Never commit API keys to source code
- Use environment variables for sensitive data in production
- Implement authentication checks for production-ready callable functions
- Follow the principle of least privilege for Firestore rules

## Testing Requirements

### Before Deployment
1. Test functions locally using Firebase emulators
2. Verify database connectivity with health check
3. Test AI responses with sample inputs
4. Validate Firestore security rules
5. Check for CodeQL security vulnerabilities

### Test Coverage
- Basic functionality tests exist in `test-learning.js`
- Health check endpoint validates system status
- Manual testing recommended for AI interactions

## Boundaries and Restrictions

### DO NOT Modify
- `functions/index.js` API_KEY line (user must configure manually)
- Firebase configuration files without understanding impact
- Firestore indexes without testing
- Security rules without validation
- Node version in `package.json` (locked to 22)

### DO NOT Commit
- API keys or secrets
- `node_modules/` directories
- `.env` files with sensitive data
- Build artifacts
- Personal Firebase configuration

### Sensitive Files
- API keys should be in environment variables (production)
- Firebase service account keys (not in repo)
- User data from Firestore (privacy compliance)

## Build and Lint
This project currently does not have a formal linting setup. When making code changes:
- Follow the existing code style
- Ensure functions are properly formatted
- Test locally with emulators before deploying
- Validate JavaScript syntax

## Documentation Standards
- Keep README.md up to date with new features
- Document new API endpoints in README
- Add usage examples to USAGE_EXAMPLES.js
- Update LEARNING_SYSTEM.md for learning algorithm changes
- Maintain SECURITY_SUMMARY.md after security scans

## Production Considerations
1. **API Key Security**: Move API_KEY to environment variables
   ```javascript
   const API_KEY = process.env.GEMINI_API_KEY;
   ```

2. **Authentication**: Enable authentication checks in `callKodyAPI`
   ```javascript
   if (!context.auth) {
       throw new functions.https.HttpsError('unauthenticated', 'Please log in.');
   }
   ```

3. **Rate Limiting**: Implement to prevent abuse
4. **Data Retention**: Add policies for GDPR compliance
5. **Monitoring**: Set up Firebase monitoring and alerts
6. **Error Logging**: Use structured logging for debugging

## Common Tasks

### Adding a New Cloud Function
1. Add function to `functions/index.js`
2. Export using `exports.functionName = functions...`
3. Test locally with emulators
4. Deploy with `firebase deploy --only functions`
5. Update README.md with new endpoint documentation

### Modifying the AI Prompt
1. Edit `systemPrompt` in `functions/index.js`
2. Test with various inputs
3. Ensure Bulgarian language is maintained
4. Verify learning context integration works

### Database Schema Changes
1. Update relevant collection structure
2. Add/modify indexes in `firestore.indexes.json`
3. Deploy indexes: `firebase deploy --only firestore:indexes`
4. Update security rules if needed
5. Document in README.md

## Known Issues
- Node.js version warning: Project specifies Node 22 but may run on Node 20 with warnings
- API key is hardcoded in source (should use environment variables)
- No formal linting or code formatting tools configured
- Test coverage is basic (only `test-learning.js`)

## Learning System
The system extracts programming topics from conversations using keyword matching:
- **Languages**: HTML, CSS, JavaScript, Python
- **Bulgarian terms**: функция, клас, променлива, масив, обект, цикъл, условие
- **English terms**: function, class, array, loop, variable
- **Technologies**: Firebase, база данни, API

Topics are stored per user and used to enhance future responses.

## Support and Resources
- Repository: https://github.com/papica777-eng/dpengeneering
- Firebase Console: Check project settings for deployment details
- Google AI Studio: For Gemini API key management
- Firebase Documentation: https://firebase.google.com/docs

## Creator
Project created by Камелия (Kamelia)  
Maintained by the dpengineering team

---

**Note**: This is an educational AI assistant for programming beginners. Always verify AI-generated code suggestions and follow best practices. The system learns from interactions to provide increasingly personalized assistance.
