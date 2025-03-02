import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import redisClient from './config/redis.js';
import routes from './routes/index.js';
import connectDB from "./config/db.js"; 
import path from 'path';

import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
//MONGODB CONNECTION
connectDB();
//configure env
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});