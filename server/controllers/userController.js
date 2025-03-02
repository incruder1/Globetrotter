import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";
import { updateLeaderboard } from "../helper/leaderboardHelper.js";
export const UserController = async(req, res) => {
//   res.json({ message: "Hello from destinations controller" });
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({ username });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findUserController= async(req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }

};
export const updateUserScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { correct, gameCompleted } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (correct) {
      user.score.correct += 1;
    } else {
      user.score.incorrect += 1;
    }

    // Update high score if current score is higher
    const currentScore = user.score.correct;
    if (currentScore > user.highScore) {
      user.highScore = currentScore;
    }

    // If game is completed, update games played and leaderboard
    if (gameCompleted) {
      user.gamesPlayed += 1;

      // Final score before reset
      const finalScore = user.score.correct;

      // Reset score for the next game
      user.score = { correct: 0, incorrect: 0 };

      await updateLeaderboard(userId, finalScore);
    }

    await user.save();
    res.json(user.score);
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ message: 'Server error' });
  }
};