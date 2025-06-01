import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
//
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import audioRoutes from './routes/audio.js';
import playlistRoutes from './routes/playlist.js';
import historyRoutes from './routes/history.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';
//
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());



// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  


app.use('/uploads', express.static('uploads')); 
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/audio', audioRoutes);
app.use('/playlists', playlistRoutes);
app.use('/history', historyRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);
// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));