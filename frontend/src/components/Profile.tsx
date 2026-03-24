import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <h1>{user?.username}</h1>
        <p className="profile-id">User ID: {user?.id}</p>

        <div className="profile-actions">
          <button onClick={() => navigate('/chat')} className="back-button">
            Back to Chat
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
