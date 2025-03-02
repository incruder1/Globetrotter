// const redis = require('redis');
import redis from 'redis';

const REDIS_URL = process.env.REDIS_URL;
// console.log('REDIS_URL:', REDIS_URL);
const redisClient = redis.createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

export default redisClient;
