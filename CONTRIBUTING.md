# Contributing to Коди AI Assistant

Thank you for your interest in contributing to Коди! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

- 🐛 Report bugs
- ✨ Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- 💡 Add new functionality

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/dpengeneering.git
   cd dpengeneering
   ```
3. **Install dependencies**:
   ```bash
   npm run install:all
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Coding Guidelines

### JavaScript/React
- Use ES6+ syntax
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names

### Commit Messages
- Use clear, descriptive commit messages
- Format: `type: description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add user authentication
fix: resolve chat history bug
docs: update installation guide
```

## 🧪 Testing

- Test your changes locally
- Run `npm run health` to verify system status
- Ensure both frontend and backend work

## 📥 Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test thoroughly**:
   ```bash
   npm run health
   npm test
   ```

3. **Create Pull Request**:
   - Describe your changes
   - Reference any related issues
   - Add screenshots if UI changes

4. **Wait for review**:
   - Address feedback
   - Keep PR updated

## 🐛 Reporting Bugs

Use GitHub Issues and include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## ✨ Suggesting Features

Open an issue with:
- Clear feature description
- Use case/motivation
- Possible implementation approach

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make Коди better for everyone!
