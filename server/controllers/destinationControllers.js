import { loadDestinations } from "../helper/destinationHelper.js";
import redisClient from "../config/redis.js";

// export const destinationsController = async (req, res) => {
//     try {
//       const { username } = req.query; // Get username from frontend
  
//       if (!username) {
//         return res.status(400).json({ message: "Username is required" });
//       }
  
//       const destinations = await loadDestinations();
//       if (destinations.length === 0) {
//         return res.status(404).json({ message: "No destinations found" });
//       }
  
//       let cacheKey = `user:${username}:usedDestinations`;
//       let usedDestinations = await redisClient.get(cacheKey);
  
//       // Convert stored JSON string to Set properly
//       usedDestinations = usedDestinations ? new Set(JSON.parse(usedDestinations)) : new Set();
  
//       // Filter out already used destinations
//       const availableDestinations = destinations.filter(d => !usedDestinations.has(d.id));
  
//       if (availableDestinations.length === 0) {
//         return res.status(200).json({ message: "All destinations have been given" });
//       }
  
//       // Pick a new random destination
//       const randomIndex = Math.floor(Math.random() * availableDestinations.length);
//       const destination = availableDestinations[randomIndex];
  
//       usedDestinations.add(destination.id); // Mark as used
  
//       // Store updated used destinations back in Redis (keep for 1 hour)
//       await redisClient.setEx(cacheKey, 3600, JSON.stringify([...usedDestinations]));
  
//       const incorrectOptions = destinations
//         .filter((d) => d.id !== destination.id)
//         .sort(() => 0.5 - Math.random())
//         .slice(0, 3);
  
//       const clueCount = Math.floor(Math.random() * 2) + 1;
//       const selectedClues = destination.clues
//         .sort(() => 0.5 - Math.random())
//         .slice(0, clueCount);
  
//       const options = [
//         { id: destination.id, name: destination.name },
//         ...incorrectOptions.map((d) => ({ id: d.id, name: d.name })),
//       ].sort(() => 0.5 - Math.random());
  
//       res.json({
//         id: destination.id,
//         clues: selectedClues,
//         options,
//         funFacts: destination.funFacts,
//         location: destination.location,
//       });
//     } catch (error) {
//       console.error("Error fetching random destination:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
  
import Destination from '../models/Destination.js';

 

export const destinationsController = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    let cacheKey = `user:${username}:usedDestinations`;
    let usedDestinations = await redisClient.get(cacheKey);
    usedDestinations = usedDestinations ? new Set(JSON.parse(usedDestinations)) : new Set();

    const destinations = await Destination.find();
    if (destinations.length === 0) {
      return res.status(404).json({ message: "No destinations found" });
    }

    const availableDestinations = destinations.filter(d => !usedDestinations.has(d._id.toString()));

    if (availableDestinations.length === 0) {
      return res.status(200).json({ message: "All destinations have been given" });
    }

    const randomIndex = Math.floor(Math.random() * availableDestinations.length);
    const destination = availableDestinations[randomIndex];

    usedDestinations.add(destination._id.toString());
    await redisClient.setEx(cacheKey, 3600, JSON.stringify([...usedDestinations]));

    const incorrectOptions = destinations
      .filter((d) => d._id.toString() !== destination._id.toString())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => ({ id: d._id.toString(), name: d.city }));

    const clueCount = Math.floor(Math.random() * 2) + 1;
    const selectedClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, clueCount);

    const options = [
      { id: destination._id.toString(), name: destination.city },
      ...incorrectOptions,
    ].sort(() => 0.5 - Math.random());

    res.json({
      id: destination._id.toString(),
      clues: selectedClues,
      options,
      funFacts: destination.fun_fact || [],
      location: `${destination.city}, ${destination.country}`,
    });
  } catch (error) {
    console.error("Error fetching random destination:", error);
    res.status(500).json({ message: "Server error" });
  }
};
