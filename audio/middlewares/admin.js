import User from '../models/User.js';

export default async function (req, res, next) {
  const user = await User.findById(req.user.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}