import Leaderboard from '../models/Leaderboard.js';
import User from '../models/userModel.js';

export const updateLeaderboard = async (userId, score) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const existingEntry = await Leaderboard.findOne({ userId });

    if (existingEntry) {
      if (score > existingEntry.score) {
        existingEntry.score = score;
        existingEntry.date = new Date();
        await existingEntry.save();
      }
    } else {
      await Leaderboard.create({
        userId,
        username: user.username,
        score
      });
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};
