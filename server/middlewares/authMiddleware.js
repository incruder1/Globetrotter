import Admin from '../models/Admin.js';

export const isAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body; // Assume adminId is sent in the request

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
