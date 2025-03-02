import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import redisClient from './config/redis.js';
import routes from './routes/index.js';
import connectDB from "./config/db.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
//MONGODB CONNECTION
connectDB();
// Middleware
app.use(cors());
app.use(express.json());
// // In-memory storage for users
// const users = {};

// // In-memory storage for admin credentials
// const adminCredentials = {
//   username: 'admin',
//   password: 'admin123' // In a real app, this would be hashed
// };
// Save leaderboard data
// const saveLeaderboard = async (leaderboardData) => {
//   try {
//     const dataPath = join(__dirname, 'data', 'leaderboard.json');
//     await fs.writeFile(dataPath, JSON.stringify(leaderboardData, null, 2), 'utf8');
//   } catch (error) {
//     console.error('Error saving leaderboard:', error);
//   }
// };

// Load leaderboard data
// const loadLeaderboard = async () => {
//   try {
//     const dataPath = join(__dirname, 'data', 'leaderboard.json');
//     const data = await fs.readFile(dataPath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     // If file doesn't exist, return empty array
//     if (error.code === 'ENOENT') {
//       return [];
//     }
//     console.error('Error loading leaderboard:', error);
//     return [];
//   }
// };

// Routes
app.use('/api', routes);
// app.get('/api/users/:userId', async(req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.put('/api/users/:userId/score', (req, res) => {
//   const { userId } = req.params;
//   const { correct, gameCompleted } = req.body;
  
//   if (!users[userId]) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   if (correct) {
//     users[userId].score.correct += 1;
//   } else {
//     users[userId].score.incorrect += 1;
//   }

//   // Update high score if current score is higher
//   const currentScore = users[userId].score.correct;
//   if (currentScore > users[userId].highScore) {
//     users[userId].highScore = currentScore;
//   }

//   // If game is completed, update games played and update leaderboard
//   if (gameCompleted) {
//     users[userId].gamesPlayed += 1;
    
//     // Reset score for next game
//     const finalScore = users[userId].score.correct;
//     users[userId].score = { correct: 0, incorrect: 0 };
    
//     // Update leaderboard asynchronously
//     updateLeaderboard(userId, finalScore);
//   }

//   res.json(users[userId].score);
// });

// Function to update leaderboard
// const updateLeaderboard = async (userId, score) => {
//   try {
//     const leaderboard = await loadLeaderboard();
//     const user = users[userId];
    
//     // Check if user already exists in leaderboard
//     const existingEntryIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
//     if (existingEntryIndex >= 0) {
//       // Update if new score is higher
//       if (score > leaderboard[existingEntryIndex].score) {
//         leaderboard[existingEntryIndex] = {
//           userId,
//           username: user.username,
//           score,
//           date: new Date()
//         };
//       }
//     } else {
//       // Add new entry
//       leaderboard.push({
//         userId,
//         username: user.username,
//         score,
//         date: new Date()
//       });
//     }
    
//     // Sort by score (descending)
//     leaderboard.sort((a, b) => b.score - a.score);
    
//     // Keep only top 100
//     const topLeaderboard = leaderboard.slice(0, 100);
    
//     // Save to file
//     await saveLeaderboard(topLeaderboard);
//   } catch (error) {
//     console.error('Error updating leaderboard:', error);
//   }
// };

// Get leaderboard
// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const leaderboard = await loadLeaderboard();
//     res.json(leaderboard);
//   } catch (error) {
//     console.error('Error fetching leaderboard:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Admin login
// app.post('/api/admin/login', (req, res) => {
//   const { username, password } = req.body;
  
//   if (username === adminCredentials.username && password === adminCredentials.password) {
//     res.json({ success: true, message: 'Login successful' });
//   } else {
//     res.status(401).json({ success: false, message: 'Invalid credentials' });
//   }
// });

// // Get all users (admin only)
// app.get('/api/admin/users', (req, res) => {
//   // In a real app, we would verify admin authentication here
//   const usersList = Object.values(users);
//   res.json(usersList);
// });

// Get game statistics (admin only)
// app.get('/api/admin/stats', async (req, res) => {
//   // In a real app, we would verify admin authentication here
//   try {
//     const usersList = Object.values(users);
//     const leaderboard = await loadLeaderboard();
    
//     const stats = {
//       totalUsers: usersList.length,
//       totalGamesPlayed: usersList.reduce((sum, user) => sum + user.gamesPlayed, 0),
//       averageScore: leaderboard.length > 0 
//         ? leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length 
//         : 0,
//       topPlayers: leaderboard.slice(0, 5)
//     };
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching admin stats:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});