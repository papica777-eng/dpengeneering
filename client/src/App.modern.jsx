import React, { useState, useCallback, useEffect, useMemo } from 'react';
import './App.css';

// Configuration
const CONFIG = {
  apiUrl: {
    development: 'http://localhost:5001/kodi-bot-7/us-central1/callKodyAPI',
    production: process.env.REACT_APP_API_URL || 'https://kodi-backend.onrender.com/api/chat'
  },
  isDevelopment: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
};

function App() {
  // State management
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate stable user ID
  const userId = useMemo(() => 
    `user_${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  // Get API URL based on environment
  const apiUrl = useMemo(() => 
    CONFIG.isDevelopment ? CONFIG.apiUrl.development : CONFIG.apiUrl.production,
    []
  );

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Send message to AI backend
   */
  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = { 
      role: 'user', 
      parts: [{ text: message.trim() }] 
    };
    
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            userId,
            sessionId: `session_${Date.now()}`,
            chatHistory: newHistory,
            userParts: [{ text: userMessage.parts[0].text }]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { 
        role: 'model', 
        parts: [{ text: data.result?.text || data.text }] 
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError('Съжалявам, имаше грешка. Моля опитайте отново.');
      
      const errorMessage = { 
        role: 'model', 
        parts: [{ 
          text: 'Съжалявам, имаше грешка при свързването. Моля проверете връзката си и опитайте отново.' 
        }] 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [message, chatHistory, isLoading, apiUrl, userId]);

  /**
   * Extract text from message object
   */
  const getMessageText = useCallback((msg) => {
    if (msg.parts?.[0]?.text) {
      return msg.parts[0].text;
    }
    return msg.text || '';
  }, []);

  /**
   * Handle input change
   */
  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  /**
   * Handle Enter key press
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  }, [handleSendMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Коди - AI Programming Assistant</h1>
        <p>Попитай ме нещо за програмиране!</p>
        {CONFIG.isDevelopment && (
          <span className="dev-badge">Development Mode</span>
        )}
      </header>
      
      <main className="chat-container">
        {error && (
          <div className="error-banner" role="alert">
            ⚠️ {error}
          </div>
        )}

        <div className="chat-messages" role="log" aria-live="polite">
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
              <div 
                key={`${msg.role}-${index}`} 
                className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="message-content">
                  <strong>{msg.role === 'user' ? 'Ти' : 'Коди'}:</strong>
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {getMessageText(msg)}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-content">
                <strong>Коди:</strong>
                <p>Мисля<span className="dots">...</span></p>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Напиши въпроса си тук..."
            className="chat-input"
            disabled={isLoading}
            aria-label="Chat message input"
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={isLoading || !message.trim()}
            aria-label="Send message"
            className="send-button"
          >
            {isLoading ? '⏳' : 'Изпрати'}
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <small>
          Powered by Google Gemini AI | Made with ❤️ by @papica777-eng
        </small>
      </footer>
    </div>
  );
}

export default App;
