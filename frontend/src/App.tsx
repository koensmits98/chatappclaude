import { useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated ? <Chat /> : <Auth />}
    </div>
  );
}

export default App;
