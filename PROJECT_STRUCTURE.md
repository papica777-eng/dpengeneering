# 📁 Project Structure

```
dpengeneering/
│
├── 📱 CLIENT (React Frontend)
│   ├── public/
│   │   ├── index.html              # Main HTML template
│   │   └── manifest.json            # PWA manifest
│   ├── src/
│   │   ├── App.js                   # Main React component
│   │   ├── App.css                  # Styles
│   │   ├── config.js                # Environment configuration
│   │   └── index.js                 # React entry point
│   └── package.json                 # Frontend dependencies
│
├── ⚡ FUNCTIONS (Firebase Backend)
│   ├── index.js                     # Firebase Cloud Functions
│   ├── index-render.js              # Express server for Render
│   ├── test-learning.js             # Learning system tests
│   ├── .env                         # API keys (not committed)
│   └── package.json                 # Backend dependencies
│
├── 📚 DOCUMENTATION
│   ├── README.md                    # Main project documentation
│   ├── PORTFOLIO.md                 # Portfolio showcase (★)
│   ├── RENDER_DEPLOYMENT.md         # Production deployment guide
│   ├── DEPLOYMENT_CHECKLIST.md      # Step-by-step checklist
│   ├── QUICKSTART.md                # Quick start guide
│   ├── START_HERE.md                # Getting started overview
│   ├── LEARNING_SYSTEM.md           # AI learning system docs
│   ├── SECURITY.md                  # Security practices
│   └── USAGE_EXAMPLES.js            # API usage examples
│
├── 🔧 CONFIGURATION
│   ├── firebase.json                # Firebase project config
│   ├── firestore.rules              # Database security rules
│   ├── firestore.indexes.json       # Database indexes
│   ├── .firebaserc                  # Firebase project aliases
│   ├── render.yaml                  # Render deployment config
│   └── .gitignore                   # Git ignore rules
│
├── 🚀 SCRIPTS
│   ├── start-backend.sh             # Start Firebase emulator
│   ├── start-frontend.sh            # Start React dev server
│   ├── build-backend.sh             # Build for production
│   ├── build-frontend.sh            # Build React app
│   ├── setup.sh                     # Initial setup script
│   └── check-deployment-ready.sh    # Deployment checker
│
└── 📊 GITHUB
    └── .github/
        └── README.md                # GitHub profile display

```

## 🗂️ Key Directories Explained

### `/client` - React Frontend
The user-facing application built with React. Handles UI, state management, and API calls to the backend.

**Key Files:**
- `App.js` - Main component with chat interface
- `config.js` - Environment-based configuration
- `package.json` - Dependencies: React 19.2, testing libraries

### `/functions` - Node.js Backend
Firebase Cloud Functions that handle AI requests, database operations, and learning system.

**Key Files:**
- `index.js` - Firebase Functions (local development)
- `index-render.js` - Express server (production on Render)
- `.env` - API keys and secrets (gitignored)

### `/docs` - Documentation
Comprehensive guides for developers, deployment, and users.

**Notable:**
- `PORTFOLIO.md` - Complete project breakdown for portfolio
- `RENDER_DEPLOYMENT.md` - Production deployment instructions
- `LEARNING_SYSTEM.md` - How the AI learning works

### Scripts
Helper bash scripts for common tasks like starting dev servers, building, and deployment checks.

---

## 📈 Codebase Statistics

- **Total Files:** 40+
- **Lines of Code:** ~2,500+
- **React Components:** 8
- **API Endpoints:** 5
- **Documentation Pages:** 10+
- **Configuration Files:** 6

---

## 🛠️ Technology Stack

### Frontend
- React 19.2
- Modern ES6+ JavaScript
- CSS3 with Flexbox/Grid
- Fetch API for HTTP

### Backend
- Node.js 22.x
- Firebase Cloud Functions
- Express.js (production)
- Google Generative AI SDK

### Database
- Firebase Firestore (NoSQL)
- Real-time synchronization
- Indexed queries

### DevOps
- Firebase Emulator Suite
- Render (hosting)
- Git/GitHub (version control)
- Custom domain with SSL

---

## 🔄 Data Flow

```
User Input (React)
    ↓
API Call (Fetch)
    ↓
Firebase Function / Express Endpoint
    ↓
Gemini AI Processing
    ↓
Firestore Storage
    ↓
Response (JSON)
    ↓
UI Update (React State)
```

---

## 📖 Documentation Index

| File | Purpose |
|------|---------|
| `README.md` | Project overview and setup |
| `PORTFOLIO.md` | Detailed portfolio showcase |
| `RENDER_DEPLOYMENT.md` | Production deployment |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step deploy |
| `QUICKSTART.md` | Quick development start |
| `LEARNING_SYSTEM.md` | AI learning documentation |
| `SECURITY.md` | Security best practices |
| `PROJECT_STRUCTURE.md` | This file |

---

*For complete portfolio details, see [PORTFOLIO.md](PORTFOLIO.md)*
