const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// --- ВАЖНО: СЛОЖИ ТВОЯ API КЛЮЧ ТУК ---
const API_KEY = "ТВОЯТ_КЛЮЧ_ТУК"; 

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `Ти си "Коди" - експертен бот-асистент по програмиране за начинаещи.
Целта ти е да помагаш с HTML, CSS, JavaScript и Python.
Винаги отговаряй на български език.
Бъди кратък, ясен и давай примери.
Ако те попитат кой те е създал, кажи че си проект на Камелия.`;

// --- Функция 1: Kody AI Callable Function ---
exports.callKodyAPI = functions.https.onCall(async (data, context) => {
    // Проверка за сигурност (активирай за продукция)
    // if (!context.auth) {
    //    throw new functions.https.HttpsError('unauthenticated', 'Моля, влезте в системата.');
    // }
    
    const history = data.chatHistory || [];
    const userParts = data.userParts || [];
    
    // Адаптация на формата за Gemini
    let partsForGemini = userParts;
    if (userParts.length > 0 && typeof userParts[0] === 'string') {
        partsForGemini = [{ text: userParts[0] }];
    }

    history.push({ role: "user", parts: partsForGemini });

    try {
        const result = await model.generateContent({
            contents: history,
            systemInstruction: { parts: [{ text: systemPrompt }] }
        });
        
        const response = await result.response;
        const text = response.text();
        
        return { text: text };

    } catch (error) {
        console.error("Error calling Gemini:", error);
        throw new functions.https.HttpsError('internal', 'Грешка в AI модела: ' + error.message);
    }
});

// --- Функция 2: Самодиагностика ---
exports.systemHealth = functions.https.onRequest(async (request, response) => {
    let healthStatus = 'OK';
    const checks = {};
    checks.server = {status: 'PASSED', message: 'Cloud Function работи.'};
    
    try {
        await db.collection('system_checks').doc('health_test').get();
        checks.database = {status: 'PASSED', message: 'Firestore е достъпен.'};
    } catch (error) {
        checks.database = {status: 'FAILED', message: `Грешка: ${error.message}`};
        healthStatus = 'ERROR';
    }
    
    response.json({ status: healthStatus, checks: checks });
});

// --- Функция 3: Поздрав ---
exports.greetUserDB = functions.https.onRequest(async (request, response) => {
    const userName = request.query.name;
    let greetingMessage;
    
    if (userName) {
        const userRef = db.collection('users').doc(userName);
        const doc = await userRef.get();
        
        if (doc.exists) {
            greetingMessage = `Здравей отново, ${userName}! Радвам се да те видя пак.`;
        } else {
            await userRef.set({ firstVisit: new Date() });
            greetingMessage = `Здравей, ${userName}! Вече си записан в базата.`;
        }
    } else {
        greetingMessage = "Здравей! Как се казваш?";
    }
    
    response.send(greetingMessage);
});