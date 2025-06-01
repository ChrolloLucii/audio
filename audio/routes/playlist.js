import express from 'express';
import auth from '../middlewares/auth.js';
import Playlist from '../models/Playlist.js';
import Audio from '../models/Audio.js';

const router = express.Router();

// Создать плейлист
router.post('/', auth, async (req, res) => {
  try {
    const playlist = new Playlist({
      name: req.body.name,
      owner: req.user.userId,
      audios: []
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (e) {
    res.status(500).json({ message: 'Create playlist error' });
  }
});

// Получить свои плейлисты
router.get('/', auth, async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user.userId }).populate('audios');
  res.json(playlists);
});

// Детали плейлиста
router.get('/:id', auth, async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.userId }).populate('audios');
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  res.json(playlist);
});

// Обновить плейлист
router.put('/:id', auth, async (req, res) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.userId },
    { name: req.body.name },
    { new: true }
  );
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  res.json(playlist);
});

// Удалить плейлист
router.delete('/:id', auth, async (req, res) => {
  const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
  res.json({ message: 'Playlist deleted' });
});

// Добавить аудио в плейлист
router.post('/:id/add', auth, async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.userId });
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

  const audio = await Audio.findById(req.body.audioId);
  if (!audio) return res.status(404).json({ message: 'Audio not found' });

  if (!playlist.audios.includes(audio._id)) {
    playlist.audios.push(audio._id);
    await playlist.save();
  }
  res.json(playlist);
});

// Убрать аудио из плейлиста
router.delete('/:id/remove', auth, async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user.userId });
  if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

  playlist.audios = playlist.audios.filter(
    audioId => audioId.toString() !== req.body.audioId
  );
  await playlist.save();
  res.json(playlist);
});

export default router;