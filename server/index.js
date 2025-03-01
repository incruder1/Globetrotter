import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for users
const users = {};

// In-memory storage for admin credentials
const adminCredentials = {
  username: 'admin',
  password: 'admin123' // In a real app, this would be hashed
};

// Load destinations data
const loadDestinations = async () => {
  try {
    const dataPath = join(__dirname, 'data', 'destinations.json');
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading destinations:', error);
    return [];
  }
};

// Save leaderboard data
const saveLeaderboard = async (leaderboardData) => {
  try {
    const dataPath = join(__dirname, 'data', 'leaderboard.json');
    await fs.writeFile(dataPath, JSON.stringify(leaderboardData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving leaderboard:', error);
  }
};

// Load leaderboard data
const loadLeaderboard = async () => {
  try {
    const dataPath = join(__dirname, 'data', 'leaderboard.json');
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error loading leaderboard:', error);
    return [];
  }
};

// Routes
app.get('/api/destinations/random', async (req, res) => {
  try {
    const destinations = await loadDestinations();
    if (destinations.length === 0) {
      return res.status(404).json({ message: 'No destinations found' });
    }

    // Get a random destination
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];

    // Get 3 random incorrect destinations for multiple choice
    const incorrectOptions = destinations
      .filter(d => d.id !== destination.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Select 1-2 random clues
    const clueCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 clues
    const selectedClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, clueCount);

    // Create options array with correct answer and incorrect options
    const options = [
      { id: destination.id, name: destination.name },
      ...incorrectOptions.map(d => ({ id: d.id, name: d.name }))
    ].sort(() => 0.5 - Math.random());

    res.json({
      id: destination.id,
      clues: selectedClues,
      options,
      funFacts: destination.funFacts,
      location: destination.location
    });
  } catch (error) {
    console.error('Error fetching random destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const userId = uuidv4();
  users[userId] = {
    id: userId,
    username,
    score: { correct: 0, incorrect: 0 },
    highScore: 0,
    gamesPlayed: 0,
    createdAt: new Date()
  };

  res.status(201).json({ userId, username });
});

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (!users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(users[userId]);
});

app.put('/api/users/:userId/score', (req, res) => {
  const { userId } = req.params;
  const { correct, gameCompleted } = req.body;
  
  if (!users[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (correct) {
    users[userId].score.correct += 1;
  } else {
    users[userId].score.incorrect += 1;
  }

  // Update high score if current score is higher
  const currentScore = users[userId].score.correct;
  if (currentScore > users[userId].highScore) {
    users[userId].highScore = currentScore;
  }

  // If game is completed, update games played and update leaderboard
  if (gameCompleted) {
    users[userId].gamesPlayed += 1;
    
    // Reset score for next game
    const finalScore = users[userId].score.correct;
    users[userId].score = { correct: 0, incorrect: 0 };
    
    // Update leaderboard asynchronously
    updateLeaderboard(userId, finalScore);
  }

  res.json(users[userId].score);
});

// Function to update leaderboard
const updateLeaderboard = async (userId, score) => {
  try {
    const leaderboard = await loadLeaderboard();
    const user = users[userId];
    
    // Check if user already exists in leaderboard
    const existingEntryIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
    if (existingEntryIndex >= 0) {
      // Update if new score is higher
      if (score > leaderboard[existingEntryIndex].score) {
        leaderboard[existingEntryIndex] = {
          userId,
          username: user.username,
          score,
          date: new Date()
        };
      }
    } else {
      // Add new entry
      leaderboard.push({
        userId,
        username: user.username,
        score,
        date: new Date()
      });
    }
    
    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 100
    const topLeaderboard = leaderboard.slice(0, 100);
    
    // Save to file
    await saveLeaderboard(topLeaderboard);
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await loadLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  // In a real app, we would verify admin authentication here
  const usersList = Object.values(users);
  res.json(usersList);
});

// Get game statistics (admin only)
app.get('/api/admin/stats', async (req, res) => {
  // In a real app, we would verify admin authentication here
  try {
    const usersList = Object.values(users);
    const leaderboard = await loadLeaderboard();
    
    const stats = {
      totalUsers: usersList.length,
      totalGamesPlayed: usersList.reduce((sum, user) => sum + user.gamesPlayed, 0),
      averageScore: leaderboard.length > 0 
        ? leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length 
        : 0,
      topPlayers: leaderboard.slice(0, 5)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});