import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes/index.js';
import connectDB from "./config/db.js"; 
import path from 'path';
import morgan from "morgan";

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
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'../dist')))
// Routes
app.use('/api', routes);
 
app.use("*", function(req,res){
  res.sendFile(path.join(__dirname,"../dist/index.html"));
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});