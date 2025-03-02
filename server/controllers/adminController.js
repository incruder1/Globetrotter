import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Leaderboard from '../models/Leaderboard.js';
import { comparePassword } from '../helper/hashHelper.js';

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
 
  
  export const adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
  
      if (!admin || !(await comparePassword(password, admin.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const adminSignup = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new Admin({
        username,
        password: hashedPassword
      });
  
      await newAdmin.save();
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.find();
    const leaderboard = await Leaderboard.find().sort({ score: -1 });

    const stats = {
      totalUsers: users.length,
      totalGamesPlayed: users.reduce((sum, user) => sum + (user.gamesPlayed || 0), 0),
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
};