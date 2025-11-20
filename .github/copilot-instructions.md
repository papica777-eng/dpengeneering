# GitHub Copilot Instructions for dpengeneering

## Project Overview

This is a Firebase project with Cloud Functions, Firestore database, and web hosting. The project uses Node.js 22 and follows modern JavaScript best practices.

## Core Principles

1. **Continuous Learning**: Stay updated with the latest trends and best practices in web development, Firebase, and cloud functions.
2. **Error-Free Code**: Always write clean, well-tested code. Verify all changes work correctly before committing.
3. **Clear Communication**: Document all changes and maintain context throughout conversations.
4. **Working Solutions**: Ensure everything functions properly - test all code changes thoroughly.

## Technology Stack

- **Runtime**: Node.js 22
- **Cloud Platform**: Firebase (Functions, Firestore, Hosting)
- **Database**: Cloud Firestore
- **Functions Framework**: Firebase Cloud Functions v6

## Coding Standards

### General Guidelines

- Use modern ES6+ JavaScript syntax
- Follow asynchronous programming best practices with async/await
- Write clear, descriptive variable and function names
- Add JSDoc comments for functions and complex logic
- Handle errors gracefully with try-catch blocks
- Always validate input data before processing

### Firebase-Specific Guidelines

- Use Firebase Admin SDK (v12+) for server-side operations
- Follow Firebase security rules best practices
- Optimize Firestore queries to minimize reads/writes
- Use Firebase Functions event triggers appropriately
- Configure proper CORS settings for HTTP functions
- Set appropriate memory and timeout configurations for functions

### Code Organization

- Keep functions focused and single-purpose
- Separate business logic from Firebase triggers
- Use helper functions and modules for reusable code
- Maintain clear file structure in the `functions` directory
- Keep configuration separate from implementation

### Testing

- Write unit tests for all business logic
- Test Firebase Functions locally using the emulator
- Validate Firestore security rules with test suites
- Test error scenarios and edge cases
- Use `firebase-functions-test` for function testing

### Security

- Never commit API keys or secrets to the repository
- Use Firebase environment configuration for sensitive data
- Implement proper authentication and authorization
- Validate all user inputs to prevent injection attacks
- Follow the principle of least privilege for database rules
- Keep dependencies updated to patch security vulnerabilities

### Performance

- Minimize cold start times for Cloud Functions
- Use Firestore batch operations when appropriate
- Implement caching strategies where beneficial
- Optimize bundle sizes for web hosting
- Monitor function execution time and memory usage

## Project Structure

```
/
├── .github/              # GitHub configuration and workflows
├── functions/            # Firebase Cloud Functions
│   ├── index.js         # Main functions entry point
│   └── package.json     # Functions dependencies
├── public/              # Static web hosting files
├── firebase.json        # Firebase project configuration
├── firestore.rules      # Firestore security rules
└── firestore.indexes.json  # Firestore indexes
```

## Development Workflow

1. **Before Making Changes**:
   - Understand the existing code and architecture
   - Check for related functions or dependencies
   - Review Firestore security rules if database changes are involved

2. **During Development**:
   - Test locally using Firebase emulators
   - Run linters and formatters
   - Validate security rules changes
   - Ensure backward compatibility

3. **Before Committing**:
   - Run all tests and ensure they pass
   - Verify the code works in the emulator environment
   - Check for console errors or warnings
   - Update documentation if needed

## Common Tasks

### Adding a New Cloud Function

1. Define the function in `functions/index.js`
2. Add appropriate trigger (HTTP, Firestore, Auth, etc.)
3. Implement error handling
4. Test locally with emulators
5. Document the function's purpose and parameters

### Updating Firestore Rules

1. Modify `firestore.rules`
2. Test rules with security rules test suite
3. Validate access patterns match application needs
4. Deploy and monitor for unauthorized access attempts

### Updating Dependencies

1. Check for security vulnerabilities
2. Review breaking changes in release notes
3. Update `package.json` with specific versions
4. Test thoroughly after updates
5. Update any deprecated API usage

## Memory and Context

- Remember all context from our conversations
- Keep track of decisions made and rationale
- Maintain consistency with previous implementations
- Reference earlier discussions when relevant
- Build upon existing patterns and conventions

## Quality Checklist

Before finalizing any change, ensure:

- [ ] Code follows project conventions and style
- [ ] All functions have proper error handling
- [ ] Security best practices are followed
- [ ] Tests pass successfully
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Code is optimized for performance
- [ ] Dependencies are up to date and secure
- [ ] Changes are minimal and focused
- [ ] Everything works as expected

## Additional Notes

- Always prioritize code quality and maintainability over speed
- Ask for clarification if requirements are unclear
- Suggest improvements when you see opportunities
- Keep the codebase clean and well-organized
- Stay current with Firebase and Node.js best practices
