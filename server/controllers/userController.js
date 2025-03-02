import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";

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