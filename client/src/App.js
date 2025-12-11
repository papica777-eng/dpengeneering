import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState('demo_user_' + Math.random().toString(36).substr(2, 9));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', parts: [{ text: message }] };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      // Determine API URL based on environment
      const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      const functionUrl = isDevelopment 
        ? 'http://localhost:5001/kodi-bot-7/us-central1/callKodyAPI'
        : (process.env.REACT_APP_API_URL || 'https://kodi-backend.onrender.com') + '/api/chat';
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userId: userId,
            sessionId: 'session_' + Date.now(),
            chatHistory: newHistory,
            userParts: [{ text: currentMessage }]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = { 
          role: 'model', 
          parts: [{ text: data.result.text }] 
        };
        setChatHistory(prev => [...prev, assistantMessage]);
      } else {
        const errorText = await response.text();
        throw new Error('Failed to get response: ' + errorText);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'model', 
        parts: [{ 
          text: 'Съжалявам, имаше грешка. Моля уверете се, че Firebase emulator-ът работи (firebase emulators:start --only functions) и че имате валиден GEMINI_API_KEY.' 
        }] 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageText = (msg) => {
    if (msg.parts && msg.parts[0] && msg.parts[0].text) {
      return msg.parts[0].text;
    }
    return msg.text || '';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Коди - AI Programming Assistant</h1>
        <p>Попитай ме нещо за програмиране!</p>
      </header>
      
      <main className="chat-container">
        <div className="chat-messages">
          {chatHistory.length === 0 ? (
            <div className="welcome-message">
              <h2>Здравей! 👋</h2>
              <p>Аз съм Коди, твоят AI асистент за програмиране. Мога да ти помогна с:</p>
              <ul>
                <li>HTML, CSS, JavaScript</li>
                <li>Python програмиране</li>
                <li>Firebase и бази данни</li>
                <li>Общи въпроси за кодиране</li>
              </ul>
              <p><small>User ID: {userId}</small></p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                <div className="message-content">
                  <strong>{msg.role === 'user' ? 'Ти' : 'Коди'}:</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{getMessageText(msg)}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-content">
                <strong>Коди:</strong>
                <p>Мисля...</p>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напиши въпроса си тук..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !message.trim()}>
            Изпрати
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
