import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Users, BarChart2, LogOut, Database, User, Award, Clock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface UserData {
  id: string;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
  highScore: number;
  gamesPlayed: number;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalGamesPlayed: number;
  averageScore: number;
  topPlayers: Array<{
    userId: string;
    username: string;
    score: number;
  }>;
}

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, logout, fetchUsers, fetchStats } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData] = await Promise.all([
          fetchUsers(),
          fetchStats()
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, navigate, fetchUsers, fetchStats]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white shadow-lg z-10">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <Globe className="mr-3" size={24} />
            <h1 className="text-xl font-bold">Globetrotter Admin</h1>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <BarChart2 className="mr-3" size={20} />
              <span>Dashboard Overview</span>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`}
            >
              <Users className="mr-3" size={20} />
              <span>User Management</span>
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="mr-2" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="ml-64 p-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                      <Database size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Games Played</p>
                      <h3 className="text-2xl font-bold">{stats.totalGamesPlayed}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-4">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Score</p>
                      <h3 className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Top Players */}
            {stats && stats.topPlayers && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Players</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.topPlayers.map((player, index) => (
                        <tr key={player.userId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{player.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{player.score}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        High Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games Played
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.highScore}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.gamesPlayed}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;