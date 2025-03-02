import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import {
  Share2,
  Globe,
  ArrowRight,
  Trophy,
  MapPin,
  Smile,
  Frown,
  Compass,
  Info,
  Clock,
  Award,
} from "lucide-react";
import { useUser } from "../context/UserContext";

interface Destination {
  id: string;
  clues: string[];
  options: { id: string; name: string }[];
  funFacts: string[];
  location: string;
}

const MAX_QUESTIONS = 10;
const TIME_PER_QUESTION = 20; // seconds

const GamePage: React.FC = () => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<
    "correct" | "incorrect" | "timeout" | null
  >(null);
  const [funFact, setFunFact] = useState<string>("");
  const { user, updateScore, resetGame } = useUser();
  const navigate = useNavigate();
  const [animateResult, setAnimateResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [correctLocation, setCorrectLocation] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRandomDestination = async () => {
    setLoading(true);
    setSelectedOption(null);
    setResult(null);
    setFunFact("");
    setAnimateResult(false);
    setTimeLeft(TIME_PER_QUESTION);

    try {
      const username=localStorage.getItem('username');
      const response = await axios.get(
        "https://globetrotter-84sf.onrender.com/api/destinations/random", {params: { username }}
      );
      setDestination(response.data);
      setCorrectLocation(response.data.location);
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoading(false);
    }
  }; 


  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    resetGame();
    fetchRandomDestination();
    setQuestionCount(0);
    setGameOver(false);

  }, []);

  useEffect(() => {
    if (loading || result || gameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, result, destination, gameOver]);

  const handleTimeout = async () => {
    if (!destination) return;

    setResult("timeout");
    setSelectedOption(null);

    const randomFunFact =
      destination.funFacts[
        Math.floor(Math.random() * destination.funFacts.length)
      ];
    setFunFact(randomFunFact);
    await updateScore(false);
    setAnimateResult(true);
  };

  const handleOptionSelect = async (optionId: string) => {
    if (result || !destination || gameOver) return;

    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(optionId);

    const isCorrect = optionId === destination.id;
    setResult(isCorrect ? "correct" : "incorrect");
    const randomFunFact =
      destination.funFacts[
        Math.floor(Math.random() * destination.funFacts.length)
      ];
    setFunFact(randomFunFact);
    await updateScore(isCorrect);
    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    setAnimateResult(true);
  };

  const handleNextQuestion = async () => {
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);

    if (newQuestionCount >= MAX_QUESTIONS) {
      setGameOver(true);
      
      await updateScore(false, true);
    } else {
      fetchRandomDestination();
    }
  };

  const handleShareClick = () => {
    if (!user) return;
    navigate(`/invite/${user.id}`);
  };

  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handlePlayAgain = () => {
    resetGame();
    setQuestionCount(0);
    setGameOver(false);
    fetchRandomDestination();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-lg">Loading your next destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
            <Globe className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Globetrotter</h1>
        </div>

        {user && (
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="font-semibold">{user.username}</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Trophy size={16} className="mr-2" />
              <span className="font-medium">
                {user.score.correct} / {questionCount}
              </span>
            </div>
            <button
              onClick={handleShareClick}
              className="bg-white text-blue-600 rounded-full px-4 py-2 flex items-center text-sm font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Share2 size={16} className="mr-2" />
              Challenge
            </button>
          </div>
        )}
      </header>

      {/* Game progress */}
      <div className="relative z-10 mb-4 max-w-2xl mx-auto w-full">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 flex items-center justify-between">
          <div className="flex items-center px-3">
            <Clock size={18} className="mr-2" />
            <span className="font-medium">{timeLeft}s</span>
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white bg-opacity-30 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="px-3 font-medium">
            Question {questionCount + 1}/{MAX_QUESTIONS}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-4">
        {gameOver ? (
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800">
            <div className="p-8 text-center">
              <div className="mb-6 inline-flex p-4 bg-blue-600 rounded-full">
                <Award size={64} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
              <p className="text-xl mb-6">
                You scored{" "}
                <span className="font-bold text-blue-600">
                  {user?.score.correct} points
                </span>{" "}
                out of {MAX_QUESTIONS}!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={handlePlayAgain}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Play Again
                </button>
                <button
                  onClick={handleViewLeaderboard}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-800">
            {destination && (
              <div className="relative">
                {/* Decorative map pattern */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                <div className="p-6 sm:p-8 relative">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <Compass className="text-blue-600 mr-3" size={28} />
                      <h2 className="text-2xl font-bold text-blue-600">
                        Guess the Destination
                      </h2>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-5 mb-6 border-l-4 border-blue-500 shadow-inner">
                      {destination.clues.map((clue, index) => (
                        <div key={index} className="mb-3 last:mb-0 flex">
                          <MapPin
                            className="text-blue-500 mr-2 flex-shrink-0 mt-1"
                            size={18}
                          />
                          <p className="text-gray-700">
                            <span className="font-semibold">
                              Clue {index + 1}:
                            </span>{" "}
                            {clue}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      Select the correct destination:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {destination.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option.id)}
                          disabled={result !== null}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                            selectedOption === option.id
                              ? option.id === destination.id
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : option.id === destination.id && result !== null
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <span className="font-medium">{option.name}</span>
                          {selectedOption === option.id &&
                            (option.id === destination.id ? (
                              <Smile className="text-green-500" size={20} />
                            ) : (
                              <Frown className="text-red-500" size={20} />
                            ))}
                          {option.id === destination.id &&
                            result !== null &&
                            selectedOption !== option.id && (
                              <Smile className="text-green-500" size={20} />
                            )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {result && (
                    <div
                      className={`rounded-xl p-5 mb-6 shadow-md transition-all transform ${
                        animateResult
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      } ${
                        result === "correct"
                          ? "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500"
                          : "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500"
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-3 rounded-full ${
                            result === "correct"
                              ? "bg-green-100 text-green-500"
                              : "bg-red-100 text-red-500"
                          } mr-4`}
                        >
                          {result === "correct" ? (
                            <Smile size={32} />
                          ) : (
                            <Frown size={32} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            {result === "correct"
                              ? "🎉 Correct Answer!"
                              : result === "timeout"
                              ? "⏰ Time's Up!"
                              : "😢 Not Quite Right!"}
                          </h3>
                          {result !== "correct" && (
                            <p className="text-gray-700 mb-2">
                              The correct answer was{" "}
                              <span className="font-semibold">
                                {destination.location}
                              </span>{" "}
                              in {correctLocation}.
                            </p>
                          )}
                          <div className="flex items-start">
                            <Info
                              size={18}
                              className="text-blue-500 mr-2 flex-shrink-0 mt-1"
                            />
                            <p className="text-gray-700">
                              <span className="font-semibold">Fun Fact:</span>{" "}
                              {funFact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-full flex items-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        Next Destination{" "}
                        <ArrowRight size={20} className="ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;
