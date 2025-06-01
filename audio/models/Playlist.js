import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Playlist', playlistSchema);