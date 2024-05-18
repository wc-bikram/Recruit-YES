// AIHelp.js

import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, List } from 'antd';
import './AIHelp.css';  // Import the CSS file

const AIHelp = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await axios.post('http://localhost:5000/api/chat', {
          prompt: input,
        });

        const botMessage = { sender: 'bot', text: response.data.message };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error communicating with the server:', error);
      }

      setInput('');
    }
  };

  return (
    <div className="container">
      <h1>AI Help</h1>
      <List
        className="message-list"
        bordered
        dataSource={messages}
        renderItem={(message) => (
          <List.Item className={`message-item ${message.sender}`}>
            <strong>{message.sender}:</strong>
            <div className="message-text">
              {message.text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </List.Item>
        )}
      />
      <div className="input-container">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type your message..."
          className="input-field"
        />
        <Button type="primary" onClick={sendMessage} className="send-button">
          Send
        </Button>
      </div>
    </div>
  );
};

export default AIHelp;
