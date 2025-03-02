import { loadDestinations } from "../helper/destinationHelper.js";
import redisClient from "../config/redis.js";
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
