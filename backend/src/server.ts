import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import messageRoutes from './routes/messages';
import { MessageModel } from './models/Message';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      username: string;
    };
    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`✅ User connected: ${user.username} (${socket.id})`);

  // Send welcome message
  socket.emit('welcome', {
    message: `Welcome to the chat, ${user.username}!`,
  });

  // Broadcast user joined
  socket.broadcast.emit('user-joined', {
    username: user.username,
    message: `${user.username} joined the chat`,
  });

  // Handle incoming messages
  socket.on('send-message', async (data: { content: string }) => {
    try {
      // Save message to database
      const message = await MessageModel.create({
        user_id: user.id,
        username: user.username,
        content: data.content,
      });

      // Broadcast message to all clients
      io.emit('new-message', {
        id: message.id,
        username: message.username,
        content: message.content,
        created_at: message.created_at,
      });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', () => {
    socket.broadcast.emit('user-typing', {
      username: user.username,
    });
  });

  socket.on('stop-typing', () => {
    socket.broadcast.emit('user-stop-typing', {
      username: user.username,
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${user.username} (${socket.id})`);
    socket.broadcast.emit('user-left', {
      username: user.username,
      message: `${user.username} left the chat`,
    });
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready for connections`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
