const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');

// Initialize Express for Render deployment
const app = express();
app.use(cors());
app.use(express.json());

// Initialize admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// API Key configuration
const API_KEY = process.env.GEMINI_API_KEY || "ТВОЯТ_КЛЮЧ_ТУК"; 

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `Ти си "Коди" - експертен бот-асистент по програмиране за начинаещи.
Целта ти е да помагаш с HTML, CSS, JavaScript и Python.
Винаги отговаряй на български език.
Бъди кратък, ясен и давай примери.
Ако те попитат кой те е създал, кажи че си проект на Камелия.

ВАЖНО: Ти имаш способността да учиш и помниш всичко от предишни разговори.
Използвай информацията от минали взаимодействия, за да даваш по-персонализирани и контекстуални отговори.
Всеки път, когато научиш нещо ново, го запомни и го използвай в бъдещи разговори.`;

// Main AI handler function
async function handleAIRequest(data) {
    const history = data.chatHistory || [];
    const userParts = data.userParts || [];
    const userId = data.userId || 'anonymous';
    const sessionId = data.sessionId || `session_${Date.now()}`;
    
    // Adapt format for Gemini
    let partsForGemini = userParts;
    if (userParts.length > 0 && typeof userParts[0] === 'string') {
        partsForGemini = [{ text: userParts[0] }];
    }

    // Retrieve past learning context for this user
    let learningContext = '';
    try {
        const userLearningDoc = await db.collection('user_learning').doc(userId).get();
        if (userLearningDoc.exists) {
            const learningData = userLearningDoc.data();
            const recentTopics = learningData.topics || [];
            const preferences = learningData.preferences || {};
            
            if (recentTopics.length > 0) {
                learningContext = `\n\nКонтекст от предишни разговори: ${recentTopics.slice(-5).join(', ')}`;
            }
            if (Object.keys(preferences).length > 0) {
                learningContext += `\nПредпочитания: ${JSON.stringify(preferences)}`;
            }
        }
    } catch (error) {
        console.error("Error retrieving learning context:", error);
    }

    // Enhanced system prompt with learning context
    const enhancedSystemPrompt = systemPrompt + learningContext;

    history.push({ role: "user", parts: partsForGemini });

    try {
        const result = await model.generateContent({
            contents: history,
            systemInstruction: { parts: [{ text: enhancedSystemPrompt }] }
        });
        
        const response = await result.response;
        const text = response.text();
        
        // Save conversation to database for learning
        const conversationData = {
            userId: userId,
            sessionId: sessionId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userMessage: userParts[0]?.text || userParts[0] || '',
            aiResponse: text,
            chatHistory: history
        };
        
        await db.collection('conversations').add(conversationData);
        
        // Extract and save learning topics
        await extractAndSaveLearning(userId, userParts[0]?.text || userParts[0] || '', text);
        
        return { text: text };

    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw new Error('Грешка в AI модела: ' + error.message);
    }
}

// Extract learning topics from conversation
async function extractAndSaveLearning(userId, userMessage, aiResponse) {
    try {
        const topicsToExtract = [
            'HTML', 'CSS', 'JavaScript', 'Python', 'React', 'Node.js',
            'Firebase', 'Database', 'API', 'Function', 'Variable', 'Loop',
            'Array', 'Object', 'Class', 'Error', 'Debug', 'Git'
        ];

        const foundTopics = [];
        const combinedText = (userMessage + ' ' + aiResponse).toLowerCase();

        topicsToExtract.forEach(topic => {
            if (combinedText.includes(topic.toLowerCase())) {
                foundTopics.push(topic);
            }
        });

        if (foundTopics.length > 0) {
            const userLearningRef = db.collection('user_learning').doc(userId);
            const doc = await userLearningRef.get();

            if (doc.exists) {
                const currentTopics = doc.data().topics || [];
                const updatedTopics = [...new Set([...currentTopics, ...foundTopics])];
                await userLearningRef.update({
                    topics: updatedTopics,
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
        }
    } catch (error) {
        console.error("Error saving learning data:", error);
    }
}

// Firebase Cloud Function (for Firebase deployment)
exports.callKodyAPI = functions.https.onCall(async (data, context) => {
    return await handleAIRequest(data);
});

// Express route (for Render deployment)
app.post('/api/chat', async (req, res) => {
    try {
        const result = await handleAIRequest(req.body.data || req.body);
        res.json({ result: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'Kodi AI Assistant API',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Export for Render
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Kodi AI API running on port ${PORT}`);
    });
}

module.exports = { app, handleAIRequest };
