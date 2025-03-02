import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import InvitePage from './pages/InvitePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';

function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/invite/:userId" element={<InvitePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AdminProvider>
  );
}

export default App;