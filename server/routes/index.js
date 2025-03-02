import express from 'express';
import routeDestination from './routedestination.js';
import routeUser from './routeUser.js';
import routeLeaderBoard from './routeLeaderBoard.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/destinations', routeDestination);
router.use('/users', routeUser);
router.use('/leaderboard', routeLeaderBoard);
router.use('/admin', adminRoutes);

export default router;
