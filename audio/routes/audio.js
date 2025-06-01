import express from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.js';
import Audio from '../models/Audio.js';
import path from 'path';
import fs from 'fs';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('audio'), async (req, res) => {
  try {
    const audio = new Audio({
      filename: req.file.filename,
      originalname: req.file.originalname,
      owner: req.user.userId
    });
    await audio.save();
    res.status(201).json(audio);
  } catch (e) {
    res.status(500).json({ message: 'Upload error' });
  }
});

router.get('/', auth, async (req, res) => {
  const audios = await Audio.find({ owner: req.user.userId });
  res.json(audios);
});

router.get('/:id', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio || audio.owner.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    res.json(audio);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching audio' });
  }
});
// Стриминг аудиофайла
router.get('/:id/stream', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio || audio.owner.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    const filePath = `uploads/${audio.filename}`;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', 'audio/mpeg');
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    res.status(500).json({ message: 'Stream error' });
  }
});
// Удалить аудиофайл
router.delete('/:id', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio || audio.owner.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    const filePath = `uploads/${audio.filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await audio.deleteOne();
    res.json({ message: 'Audio deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Delete error' });
  }
});

// Обновить метаданные аудиофайла
router.put('/:id', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio || audio.owner.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    audio.originalname = req.body.originalname || audio.originalname;
    await audio.save();
    res.json(audio);
  } catch (e) {
    res.status(500).json({ message: 'Update error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Audio not found' });
    if (!audio.likes.includes(req.user.userId)) {
      audio.likes.push(req.user.userId);
      await audio.save();
    }
    res.json({ likes: audio.likes.length });
  } catch (e) {
    res.status(500).json({ message: 'Like error' });
  }
});

// Убрать лайк
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Audio not found' });
    audio.likes = audio.likes.filter(
      userId => userId.toString() !== req.user.userId
    );
    await audio.save();
    res.json({ likes: audio.likes.length });
  } catch (e) {
    res.status(500).json({ message: 'Unlike error' });
  }
});

// Добавить комментарий
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) return res.status(404).json({ message: 'Audio not found' });
    const comment = {
      user: req.user.userId,
      text: req.body.text,
      createdAt: new Date()
    };
    audio.comments.push(comment);
    await audio.save();
    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ message: 'Comment error' });
  }
});

// Получить комментарии
router.get('/:id/comments', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id).populate('comments.user', 'username');
    if (!audio) return res.status(404).json({ message: 'Audio not found' });
    res.json(audio.comments);
  } catch (e) {
    res.status(500).json({ message: 'Get comments error' });
  }
});


export default router;