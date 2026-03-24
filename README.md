# Chat App with Claude

A real-time chat application built with React, Express, Socket.io, and PostgreSQL.

## Features
- User authentication (signup/login)
- Real-time messaging with WebSockets
- Message history stored in PostgreSQL
- TypeScript for type safety

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Authentication**: JWT tokens

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Database Setup
Create a PostgreSQL database:
```bash
createdb chatapp
```

### 3. Environment Variables
Create `.env` files in the backend directory:

**backend/.env**:
```
PORT=3001
DATABASE_URL=postgresql://localhost/chatapp
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### 4. Run the Application
```bash
# Run both frontend and backend
npm run dev

# Or run them separately:
npm run dev:backend
npm run dev:frontend
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure
```
chatappclaude/
├── backend/          # Express API + Socket.io server
│   ├── src/
│   │   ├── config/   # Database and config
│   │   ├── routes/   # API routes
│   │   ├── models/   # Database models
│   │   └── server.ts # Entry point
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── package.json      # Root package file
```
