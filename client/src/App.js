import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // This is a placeholder for Firebase Cloud Functions call
      // In production, you would call your Firebase function here
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: message,
          chatHistory: chatHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [...prev, { role: 'assistant', text: data.response }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error. Please make sure the backend is running.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Коди - AI Programming Assistant</h1>
        <p>Ask me anything about programming!</p>
      </header>
      
      <main className="chat-container">
        <div className="chat-messages">
          {chatHistory.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome! 👋</h2>
              <p>I'm Коди, your AI programming assistant. I can help you with:</p>
              <ul>
                <li>HTML, CSS, JavaScript</li>
                <li>Python programming</li>
                <li>Firebase and databases</li>
                <li>General coding questions</li>
              </ul>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  <strong>{msg.role === 'user' ? 'You' : 'Коди'}:</strong>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-content">
                <strong>Коди:</strong>
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question here..."
            className="chat-input"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !message.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
