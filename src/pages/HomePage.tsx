import { useState, FunctionComponent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, MapPin, Compass, Users, Trophy, Clock } from "lucide-react";
import { useUser } from "../context/UserContext";
 

const HomePage: FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { registerUser, loading } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    try {
       
      await registerUser(username);
      navigate("/game");
    } catch (error) {
      setError(`Failed to register. Please try again. Error: ${error}`);
    }
  };

  const handleViewLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
            filter: "brightness(0.4)",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-3xl mx-auto">
            <div className="mb-6 inline-flex p-4 bg-blue-600 bg-opacity-90 rounded-full">
              <Globe size={64} className="text-white" />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-4">
              <span className="block">Globetrotter</span>
              <span className="block text-2xl mt-2 font-medium">
                Test Your World Knowledge
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-100 max-w-2xl mx-auto">
              Embark on a virtual journey around the world! Solve cryptic clues
              about famous landmarks and discover fascinating facts about our
              planet's most iconic destinations.
            </p>

            <div className="mt-10 max-w-md mx-auto">
              <div className="bg-white bg-opacity-95 rounded-lg shadow-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Choose your explorer name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users size={18} className="text-gray-400" />
                      </div>
                       
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Your username"
                      />
                    </div>
                    {error && (
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 transform hover:scale-105"
                  >
                    {loading ? "Loading..." : "Start Your Adventure"}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={handleViewLeaderboard}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Global Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How to Play
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Test your knowledge of famous places around the world in this fun,
              educational game!
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 rounded-lg p-6 shadow-md transform transition duration-300 hover:scale-105">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Solve Clues
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  You'll be given cryptic clues about a famous place or landmark
                  from around the world.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 shadow-md transform transition duration-300 hover:scale-105">
                <div className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg mb-4">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Choose Wisely
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Select the correct destination from multiple options and test
                  your geographical knowledge.
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-6 shadow-md transform transition duration-300 hover:scale-105">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-md shadow-lg mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Beat the Clock
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  You have 20 seconds to answer each question. Think fast and
                  answer correctly!
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 shadow-md transform transition duration-300 hover:scale-105">
                <div className="inline-flex items-center justify-center p-3 bg-green-600 rounded-md shadow-lg mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Compete Globally
                </h3>
                <p className="mt-2 text-base text-gray-600">
                  Challenge friends and climb the global leaderboard with your
                  high scores!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Globe className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">Globetrotter</span>
          </div>
          <p className="text-gray-400 text-sm">
            Test your knowledge of famous places around the world!
          </p>
          <div className="mt-4">
            <a href="/admin" className="text-gray-400 hover:text-white text-sm">
              Admin Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
