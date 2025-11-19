const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- ВАЖНО: СЛОЖИ ТВОЯ API КЛЮЧ ТУК ---
const API_KEY = "ТВОЯТ_КЛЮЧ_ТУК"; 

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `Ти си "Коди" - експертен бот-асистент по програмиране за начинаещи.
Целта ти е да помагаш с HTML, CSS, JavaScript и Python.
Винаги отговаряй на български език.
Бъди кратък, ясен и давай примери.
Ако те попитат кой те е създал, кажи че си проект на Камелия.`;

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