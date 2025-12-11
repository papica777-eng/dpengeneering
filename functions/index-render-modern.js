const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { 
  apiLimiter, 
  healthCheckLimiter, 
  securityHeaders, 
  validateChatInput, 
  errorHandler, 
  requestLogger, 
  corsOptions,
  validateApiKey
} = require('./middleware');

// Load environment variables
require('dotenv').config();

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'kodi-bot-7'
  });
}

const db = admin.firestore();

// Configuration
const CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash',
  port: process.env.PORT || 5001,
  maxTokens: 32000,
  temperature: 0.7
};

// Validate configuration
if (!CONFIG.apiKey || CONFIG.apiKey === 'your_api_key_here') {
  console.error('⚠️  CRITICAL: GEMINI_API_KEY not configured!');
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(CONFIG.apiKey);
const model = genAI.getGenerativeModel({ 
  model: CONFIG.model,
  generationConfig: {
    temperature: CONFIG.temperature,
    maxOutputTokens: CONFIG.maxTokens
  }
});

// System prompt
const SYSTEM_PROMPT = `Ти си "Коди" - експертен бот-асистент по програмиране за начинаещи.
Целта ти е да помагаш с HTML, CSS, JavaScript и Python.
Винаги отговаряй на български език.
Бъди кратък, ясен и давай примери.
Ако те попитат кой те е създал, кажи че си проект на Камелия.

ВАЖНО: Ти имаш способността да учиш и помниш всичко от предишни разговори.
Използвай информацията от минали взаимодействия, за да даваш по-персонализирани и контекстуални отговори.`;

// Topics for learning
const PROGRAMMING_TOPICS = [
  'HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Node.js',
  'Firebase', 'Database', 'API', 'Function', 'Variable', 'Loop',
  'Array', 'Object', 'Class', 'Error', 'Debug', 'Git', 'JSON',
  'Async', 'Promise', 'DOM', 'Event', 'Framework', 'Library'
];

// Create Express app
const app = express();

// Apply security middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));

// Health check endpoint (lenient rate limit)
app.get('/health', healthCheckLimiter, (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    service: 'Kodi AI Assistant',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kodi AI Assistant API',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      stats: '/api/stats',
      history: '/api/history'
    }
  });
});

/**
 * Get user learning context
 */
async function getUserLearningContext(userId) {
  try {
    const userDoc = await db.collection('user_learning').doc(userId).get();
    
    if (!userDoc.exists) {
      return '';
    }

    const learningData = userDoc.data();
    const recentTopics = (learningData.topics || []).slice(-5);
    const preferences = learningData.preferences || {};
    
    let context = '';
    if (recentTopics.length > 0) {
      context += `\n\nКонтекст от предишни разговори: ${recentTopics.join(', ')}`;
    }
    if (Object.keys(preferences).length > 0) {
      context += `\nПредпочитания: ${JSON.stringify(preferences)}`;
    }
    
    return context;
  } catch (error) {
    console.error('Error retrieving learning context:', error);
    return '';
  }
}

/**
 * Extract and save learning data
 */
async function extractAndSaveLearning(userId, userMessage, aiResponse) {
  try {
    const combinedText = `${userMessage} ${aiResponse}`.toLowerCase();
    const foundTopics = PROGRAMMING_TOPICS.filter(topic => 
      combinedText.includes(topic.toLowerCase())
    );

    if (foundTopics.length === 0) return;

    const userLearningRef = db.collection('user_learning').doc(userId);
    const doc = await userLearningRef.get();

    if (doc.exists) {
      const currentTopics = doc.data().topics || [];
      const uniqueTopics = [...new Set([...currentTopics, ...foundTopics])];
      await userLearningRef.update({
        topics: uniqueTopics,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await userLearningRef.set({
        topics: foundTopics,
        preferences: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving learning data:', error);
  }
}

/**
 * Save conversation
 */
async function saveConversation(conversationData) {
  try {
    await db.collection('conversations').add({
      ...conversationData,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
}

// Main chat endpoint
app.post('/api/chat', apiLimiter, validateApiKey, validateChatInput, async (req, res, next) => {
  try {
    const { userId = 'anonymous', sessionId, chatHistory = [], userParts = [] } = req.body.data;

    // Format user message
    const formattedParts = Array.isArray(userParts) && typeof userParts[0] === 'string'
      ? [{ text: userParts[0] }]
      : userParts;

    // Get learning context
    const learningContext = await getUserLearningContext(userId);
    const enhancedPrompt = SYSTEM_PROMPT + learningContext;

    // Prepare history
    const history = [...chatHistory, { role: 'user', parts: formattedParts }];

    // Generate AI response
    const result = await model.generateContent({
      contents: history,
      systemInstruction: { parts: [{ text: enhancedPrompt }] }
    });

    const response = await result.response;
    const responseText = response.text();

    // Save conversation and learning data
    const conversationData = {
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      userMessage: formattedParts[0]?.text || '',
      aiResponse: responseText,
      chatHistory: history
    };

    await Promise.all([
      saveConversation(conversationData),
      extractAndSaveLearning(userId, conversationData.userMessage, responseText)
    ]);

    res.json({ 
      result: { text: responseText },
      sessionId: conversationData.sessionId
    });

  } catch (error) {
    next(error);
  }
});

// Get user learning stats
app.post('/api/stats', apiLimiter, async (req, res, next) => {
  try {
    const { userId } = req.body.data;
    
    if (!userId) {
      return res.status(400).json({
        error: 'invalid_argument',
        message: 'userId is required'
      });
    }

    const userDoc = await db.collection('user_learning').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.json({
        topics: [],
        totalTopics: 0,
        preferences: {},
        exists: false
      });
    }

    const data = userDoc.data();
    res.json({
      topics: data.topics || [],
      totalTopics: (data.topics || []).length,
      preferences: data.preferences || {},
      lastUpdated: data.lastUpdated,
      exists: true
    });
  } catch (error) {
    next(error);
  }
});

// Get conversation history
app.post('/api/history', apiLimiter, async (req, res, next) => {
  try {
    const { userId, limit = 10 } = req.body.data;
    
    if (!userId) {
      return res.status(400).json({
        error: 'invalid_argument',
        message: 'userId is required'
      });
    }

    const snapshot = await db.collection('conversations')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ 
      conversations, 
      count: conversations.length 
    });
  } catch (error) {
    next(error);
  }
});

// Apply error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(CONFIG.port, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║        🤖 Kodi AI Assistant API v2.0              ║
║                                                    ║
║  Status: Running                                   ║
║  Port: ${CONFIG.port}                                       ║
║  Environment: ${process.env.NODE_ENV || 'development'}                    ║
║  Model: ${CONFIG.model}                       ║
║                                                    ║
║  Endpoints:                                        ║
║    - GET  /health                                  ║
║    - POST /api/chat                                ║
║    - POST /api/stats                               ║
║    - POST /api/history                             ║
║                                                    ║
║  Security: ✅ Rate limiting, validation, CORS     ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
