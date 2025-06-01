import express from 'express';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';
import Audio from '../models/Audio.js';

const router = express.Router();

// Получить историю прослушиваний
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('history.audio');
  res.json(user.history);
});

// Очистить историю
router.delete('/', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.userId, { history: [] });
  res.json({ message: 'History cleared' });
});

// Рекомендации (простой пример: случайные аудиофайлы)
router.get('/recommendations', auth, async (req, res) => {
  const audios = await Audio.aggregate([{ $sample: { size: 5 } }]);
  res.json(audios);
});

export default router;