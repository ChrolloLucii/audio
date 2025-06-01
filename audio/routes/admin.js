import express from 'express';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import Audio from '../models/Audio.js';

const router = express.Router();

// Получить все аудиофайлы (для модерации)
router.get('/audio', auth, admin, async (req, res) => {
  const audios = await Audio.find().populate('owner', 'username email');
  res.json(audios);
});

// Удалить любой аудиофайл
router.delete('/audio/:id', auth, admin, async (req, res) => {
  const audio = await Audio.findByIdAndDelete(req.params.id);
  if (!audio) return res.status(404).json({ message: 'Audio not found' });
  res.json({ message: 'Audio deleted by admin' });
});

export default router;