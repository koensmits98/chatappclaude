import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import { Profile } from './components/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/chat" replace /> : <Auth />}
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
