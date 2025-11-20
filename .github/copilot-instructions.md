# GitHub Copilot Instructions

## Project Overview
This is a Firebase-based web application with Cloud Functions backend and static frontend hosting. The project includes:
- Firebase Cloud Functions (Node.js)
- Firestore database
- Firebase Hosting for static web content
- Integration with Google Generative AI (Gemini)

## Technology Stack
- **Backend**: Node.js 22, Firebase Functions, Firebase Admin SDK
- **AI/ML**: Google Generative AI (Gemini 1.5 Flash)
- **Database**: Cloud Firestore
- **Hosting**: Firebase Hosting
- **Frontend**: HTML, CSS, JavaScript (vanilla)

## Language and Localization
- **Primary language for UI/messages**: Bulgarian (български)
- User-facing strings, comments, and messages should be in Bulgarian
- Code identifiers (variables, functions) can be in English for clarity
- System prompts and error messages should be in Bulgarian

## Code Style and Conventions

### JavaScript
- Use `const` and `let` instead of `var`
- Use async/await for asynchronous operations
- Include proper error handling with try-catch blocks
- Use Firebase Functions v2 style when possible
- Follow Node.js CommonJS module pattern (require/exports)

### Cloud Functions
- All HTTP functions should include proper error handling
- Use `functions.https.onCall` for callable functions with client-side SDKs
- Use `functions.https.onRequest` for HTTP endpoints
- Always validate input data in cloud functions
- Include appropriate CORS headers when needed
- Log errors to console for debugging

### Firestore
- Use descriptive collection and document names
- Implement proper security rules
- Use batch operations for multiple writes when possible
- Handle document snapshots appropriately

### Security
- Never commit API keys or secrets to source code
- Use environment variables for sensitive configuration
- Implement authentication checks in production functions
- Follow Firebase security best practices
- Validate all user inputs

## File Structure
```
/
├── .github/              # GitHub configuration
├── functions/            # Cloud Functions code
│   ├── index.js         # Main functions file
│   └── package.json     # Functions dependencies
├── public/              # Static hosting files
│   ├── index.html       # Main web page
│   └── manifest/        # PWA manifest
├── firebase.json        # Firebase project configuration
├── firestore.rules      # Firestore security rules
└── firestore.indexes.json # Firestore indexes
```

## Testing
- Use Firebase emulators for local testing
- Test functions before deploying to production
- Use `firebase-functions-test` for unit testing cloud functions

## Deployment
- Deploy functions with: `npm run deploy` (from functions directory)
- Deploy hosting with: `firebase deploy --only hosting`
- Use Firebase emulators for local development

## Comments and Documentation
- Write comments in Bulgarian for user-facing logic
- Use English for technical/system comments if clearer
- Document complex logic and algorithms
- Include JSDoc comments for public functions

## AI/ML Guidelines
- When working with Google Generative AI:
  - Use structured prompts with clear system instructions
  - Handle API errors gracefully
  - Implement rate limiting if necessary
  - Keep API keys secure in environment variables

## Best Practices
- Keep functions small and focused on a single task
- Use appropriate Firebase service quotas and limits
- Implement proper logging for debugging
- Follow the principle of least privilege for security rules
- Test thoroughly before deploying to production
