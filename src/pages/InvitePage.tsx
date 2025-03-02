import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Globe, ArrowLeft, Trophy } from 'lucide-react';
import { useUser } from '../context/UserContext';

const InvitePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { fetchUserById } = useUser();
  const [inviter, setInviter] = useState<{ username: string; score: { correct: number; incorrect: number }; highScore?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setError('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const user = await fetchUserById(userId);
        if (user) {
          setInviter(user);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError(`Failed to load user information: ${err}`);

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, fetchUserById]);

  const handleShare = async () => {
    if (!inviter) return;

    const shareUrl = window.location.href;
    const shareText = `I challenge you to beat my Globetrotter score of ${inviter.highScore || inviter.score.correct}! Can you guess these famous places? ${shareUrl}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Globetrotter Challenge',
                text: shareText,
                url: shareUrl,
            });
            return;
        } catch (error) {
            console.log('Error sharing:', error);
        }
    }

    // Copy URL to clipboard as fallback
    try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback to WhatsApp sharing if clipboard fails
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
    }
};


  const handlePlayGame = () => {
    navigate('/game');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden text-gray-800 p-6">
          <div className="flex justify-center mb-6">
            <Globe size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-center text-red-500 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      <header className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-white hover:underline"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <div 
          ref={cardRef}
          className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden text-gray-800"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-center mb-4">
              <Globe size={64} />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Globetrotter Challenge</h1>
          </div>
          
          <div className="p-6">
            {inviter && (
              <>
                <div className="text-center mb-6">
                  <p className="text-xl font-semibold mb-2">
                    {inviter.username} has challenged you!
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 inline-flex items-center">
                    <Trophy className="text-blue-600 mr-2" size={24} />
                    <span className="text-lg font-bold text-blue-800">
                      High Score: {inviter.highScore || inviter.score.correct}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Think you can do better?
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={handlePlayGame}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 transform hover:scale-105"
                  >
                    Accept Challenge
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center transform hover:scale-105"
                  >
                    <Share2 size={20} className="mr-2" />
                    Share with Friends
                  </button>
                </div>
                
                <div className="mt-8 bg-blue-50 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">How to Play:</h2>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>You'll be given cryptic clues about a famous place</li>
                    <li>Choose the correct destination from multiple options</li>
                    <li>You have 20 seconds to answer each question</li>
                    <li>Answer 10 questions to complete the challenge</li>
                    <li>Challenge your friends to beat your score!</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;