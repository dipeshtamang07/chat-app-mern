// src/components/Chat.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useUser } from '../contexts/UserContext';

const Chat = () => {
  const { room } = useParams();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { user } = useUser();

  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    newSocket.emit('joinRoom', room);

    newSocket.on('connect', () => {
      setIsConnected(true); // Update connection status when connected
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false); // Update connection status when disconnected
    });

    newSocket.on('message', (message) => {
      console.log({ message });
      if (message.user && user.name && message.user === user.name) {
        message.user.name = "You";
      }
      setMessages([...messages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [room, messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    socket.emit('sendMessage', room, { user: user?.name || "Unknown", text: newMessage });
    setMessages(prev => [...prev, { user: "You", text: newMessage }]);

    setNewMessage('');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        Room: {room}
        {isConnected && <span className="ml-2 text-green-500">●</span>}
      </h2>
      <div className="border rounded p-4 mb-4 h-60 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${message.user === "You" ? 'text-left bg-green-100' : 'text-right bg-gray-100'
              }`}
            style={{
              borderRadius: message.user === "You" ? '12px 12px 0 12px' : '12px 12px 12px 0',
              maxWidth: '70%', // Adjust the maximum width as needed
              marginLeft: message.user === "You" ? '0' : 'auto',
              marginRight: message.user === "You" ? 'auto' : '0',
              padding: '10px',
              position: 'relative',
            }}
          >
            <span
              className="font-semibold"
              style={{
                position: 'absolute',
                top: '-15px',
                left: message.user === "You" ? '10px' : 'auto',
                right: message.user === "You" ? 'auto' : '10px',
              }}
            >
              {message.user}
            </span>
            {message.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded p-2 mr-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
