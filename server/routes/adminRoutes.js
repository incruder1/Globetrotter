import express from 'express';
import { adminLogin,adminSignup, getAllUsers, getAdminStats} from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/login', adminLogin);
router.post('/signup', adminSignup);
router.get('/users', isAdmin, getAllUsers);
router.get('/stats', isAdmin, getAdminStats);

export default router;
