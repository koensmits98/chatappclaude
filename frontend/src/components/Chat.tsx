import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socket';
import { api } from '../services/api';
import type { Message } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

export const Chat: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load message history
    loadMessages();

    // Set up socket listeners
    const socket = socketService.getSocket();
    if (socket) {
      socket.on('welcome', (data: { message: string }) => {
        showSystemMessage(data.message);
      });

      socket.on('new-message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on('user-joined', (data: { username: string; message: string }) => {
        showSystemMessage(data.message);
      });

      socket.on('user-left', (data: { username: string; message: string }) => {
        showSystemMessage(data.message);
      });

      socket.on('user-typing', (data: { username: string }) => {
        setTypingUser(data.username);
      });

      socket.on('user-stop-typing', () => {
        setTypingUser(null);
      });

      socket.on('error', (data: { message: string }) => {
        showSystemMessage(`Error: ${data.message}`);
      });
    }

    return () => {
      if (socket) {
        socket.off('welcome');
        socket.off('new-message');
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('user-typing');
        socket.off('user-stop-typing');
        socket.off('error');
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, systemMessage]);

  const loadMessages = async () => {
    try {
      const data = await api.getMessages(100);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const showSystemMessage = (message: string) => {
    setSystemMessage(message);
    setTimeout(() => setSystemMessage(''), 3000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketService.emit('send-message', {
      content: newMessage.trim(),
    });

    setNewMessage('');
    stopTyping();
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);

    // Emit typing event
    socketService.emit('typing');

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    socketService.emit('stop-typing');
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h1>Chat App</h1>
          <p className="user-info">Logged in as {user?.username}</p>
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate('/profile')} className="profile-button">
            Profile
          </button>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {systemMessage && (
        <div className="system-message">{systemMessage}</div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.username === user?.username ? 'own-message' : ''
            }`}
          >
            <div className="message-header">
              <span className="message-username">{message.username}</span>
              <span className="message-time">{formatTime(message.created_at)}</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUser && (
        <div className="typing-indicator">
          {typingUser} is typing...
        </div>
      )}

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
          autoFocus
        />
        <button type="submit" className="send-button" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};
