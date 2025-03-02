import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Globe, ArrowLeft, Trophy, Medal, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  date: string;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('https://globetrotter-84sf.onrender.com/api/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getUserRank = (): number => {
    if (!user) return -1;
    const index = leaderboard.findIndex(entry => entry.userId === user.id);
    return index + 1;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400'; 
      case 2: return 'text-amber-700';
      default: return 'text-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white hover:underline"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </button>
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
            <Globe className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Globetrotter</h1>
        </div>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>
      
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <Trophy size={32} className="mr-3" />
              <h2 className="text-2xl font-bold">Global Leaderboard</h2>
            </div>
            {user && getUserRank() > 0 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                <p className="text-sm">
                  Your Rank: <span className="font-bold">{getUserRank()}</span> of {leaderboard.length}
                </p>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No scores recorded yet. Be the first!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => (
                      <tr 
                        key={entry.userId} 
                        className={user && entry.userId === user.id ? 'bg-blue-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Medal className={`mr-2 ${getMedalColor(index)}`} size={20} />
                            ) : (
                              <span className="text-gray-500 font-medium w-6 text-center">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.username}
                            {user && entry.userId === user.id && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">{entry.score}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(entry.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate('/game')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all transform hover:scale-105"
              >
                Play Game
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;