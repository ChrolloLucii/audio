import express from 'express';
import auth from '../middlewares/auth.js';
import Audio from '../models/Audio.js';
import User from '../models/User.js';

const router = express.Router();

// Поиск аудиофайлов по названию (originalname)
router.get('/audio', auth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const audios = await Audio.find({
    originalname: { $regex: q, $options: 'i' }
  });
  res.json(audios);
});

// Поиск пользователей по username или email
router.get('/users', auth, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  }).select('-password');
  res.json(users);
});

export default router;