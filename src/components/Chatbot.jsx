import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! How can I assist you with your travel plans?' }]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Automatically open chatbot when the page loads
        setIsOpen(true);
    }, []);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
        setInput('');

        try {
            const response = await axios.post('http://localhost:5000/api/chatbot', { message: input });
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
                Chat with Us
            </div>
            {isOpen && (
                <div className="chatbot-body">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>{msg.text}</div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
