const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { onCall, HttpsError } = require('firebase-functions/v2/https');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// Configuration with validation
const CONFIG = {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    maxTokens: 32000,
    temperature: 0.7,
    maxRetries: 3
};

// Validate API key on startup
if (!CONFIG.apiKey || CONFIG.apiKey === 'ТВОЯТ_КЛЮЧ_ТУК') {
    console.error('⚠️  GEMINI_API_KEY not configured properly!');
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

// System prompt configuration
const SYSTEM_PROMPT = `Ти си "Коди" - експертен бот-асистент по програмиране за начинаещи.
Целта ти е да помагаш с HTML, CSS, JavaScript и Python.
Винаги отговаряй на български език.
Бъди кратък, ясен и давай примери.
Ако те попитат кой те е създал, кажи че си проект на Камелия.

ВАЖНО: Ти имаш способността да учиш и помниш всичко от предишни разговори.
Използвай информацията от минали взаимодействия, за да даваш по-персонализирани и контекстуални отговори.`;

// Topics for learning system
const PROGRAMMING_TOPICS = [
    'HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Node.js',
    'Firebase', 'Database', 'API', 'Function', 'Variable', 'Loop',
    'Array', 'Object', 'Class', 'Error', 'Debug', 'Git', 'JSON',
    'Async', 'Promise', 'DOM', 'Event', 'Framework', 'Library'
];

/**
 * Retrieve user's learning context from Firestore
 * @param {string} userId - User identifier
 * @returns {Promise<string>} Learning context string
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
 * Extract and save programming topics from conversation
 * @param {string} userId - User identifier
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
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

        const updateData = {
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        if (doc.exists) {
            // Update existing document
            const currentTopics = doc.data().topics || [];
            const uniqueTopics = [...new Set([...currentTopics, ...foundTopics])];
            updateData.topics = uniqueTopics;
            await userLearningRef.update(updateData);
        } else {
            // Create new document
            await userLearningRef.set({
                topics: foundTopics,
                preferences: {},
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                ...updateData
            });
        }
    } catch (error) {
        console.error('Error saving learning data:', error);
        throw new HttpsError('internal', 'Failed to save learning data');
    }
}

/**
 * Save conversation to Firestore
 * @param {Object} conversationData - Conversation details
 */
async function saveConversation(conversationData) {
    try {
        await db.collection('conversations').add({
            ...conversationData,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error saving conversation:', error);
        throw new HttpsError('internal', 'Failed to save conversation');
    }
}

/**
 * Main AI callable function (Firebase Functions v2)
 * Handles AI interactions with learning capabilities
 */
exports.callKodyAPI = onCall({
    maxInstances: 10,
    memory: '256MiB',
    timeoutSeconds: 30,
    cors: true
}, async (request) => {
    try {
        // Extract and validate request data
        const { userId = 'anonymous', sessionId, chatHistory = [], userParts = [] } = request.data;

        if (!userParts || userParts.length === 0) {
            throw new HttpsError('invalid-argument', 'userParts is required');
        }

        // Format user message for Gemini
        const formattedParts = Array.isArray(userParts) && typeof userParts[0] === 'string'
            ? [{ text: userParts[0] }]
            : userParts;

        // Get user's learning context
        const learningContext = await getUserLearningContext(userId);
        const enhancedPrompt = SYSTEM_PROMPT + learningContext;

        // Prepare chat history
        const history = [...chatHistory, { role: 'user', parts: formattedParts }];

        // Generate AI response
        const result = await model.generateContent({
            contents: history,
            systemInstruction: { parts: [{ text: enhancedPrompt }] }
        });

        const response = await result.response;
        const responseText = response.text();

        // Save conversation and extract learning
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

        return { text: responseText };

    } catch (error) {
        console.error('Error in callKodyAPI:', error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError('internal', `AI Error: ${error.message}`);
    }
});

/**
 * Health check endpoint
 */
exports.systemHealth = onCall({ cors: true }, async () => {
    return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        service: 'Kodi AI Assistant'
    };
});

/**
 * Get user learning statistics
 */
exports.getUserLearningStats = onCall({ cors: true }, async (request) => {
    try {
        const { userId } = request.data;
        
        if (!userId) {
            throw new HttpsError('invalid-argument', 'userId is required');
        }

        const userDoc = await db.collection('user_learning').doc(userId).get();
        
        if (!userDoc.exists) {
            return {
                topics: [],
                totalTopics: 0,
                preferences: {},
                exists: false
            };
        }

        const data = userDoc.data();
        return {
            topics: data.topics || [],
            totalTopics: (data.topics || []).length,
            preferences: data.preferences || {},
            lastUpdated: data.lastUpdated,
            exists: true
        };
    } catch (error) {
        console.error('Error getting learning stats:', error);
        throw new HttpsError('internal', error.message);
    }
});

/**
 * Get conversation history for a user
 */
exports.getConversationHistory = onCall({ cors: true }, async (request) => {
    try {
        const { userId, limit = 10 } = request.data;
        
        if (!userId) {
            throw new HttpsError('invalid-argument', 'userId is required');
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

        return { conversations, count: conversations.length };
    } catch (error) {
        console.error('Error getting conversation history:', error);
        throw new HttpsError('internal', error.message);
    }
});
