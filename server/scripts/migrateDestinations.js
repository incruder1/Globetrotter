// import mongoose from 'mongoose';
// import Destination from '../models/Destination.js';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();

// const migrateData = async () => {
//   try {
//     // Ensure MongoDB URI is loaded
//     if (!process.env.MONGO_URI) {
//       throw new Error('MONGO_URI is not defined. Check your .env file.');
//     }

//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000,
//     });

//     const __dirname = path.dirname(fileURLToPath(import.meta.url));
//     const filePath = path.join(__dirname, '../helper/data/destinations.json');
//     console.log('filePath:', filePath);

//     const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//     await Destination.insertMany(data);
//     console.log('Migration completed!');
//     process.exit();
//   } catch (error) {
//     console.error('Error in migration:', error);
//     process.exit(1);
//   }
// };

// migrateData();
// For Migration