import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }, // <--- добавьте это
  history: [{
    audio: { type: mongoose.Schema.Types.ObjectId, ref: 'Audio' },
    listenedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('User', userSchema);