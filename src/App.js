import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setError('');

    if (!API_ENDPOINT || !API_KEY) {
      setError('API configuration is missing. Please check your environment variables.');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINT,
        { message: input },
        { headers: { 'Authorization': `Bearer ${API_KEY}` } }
      );
      const botMessage = { role: 'bot', content: response.data.message };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Chat GPT-like App</h1>
      </header>
      <main>
        <div className="chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
          {error && <div className="error-message">{error}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default App;
