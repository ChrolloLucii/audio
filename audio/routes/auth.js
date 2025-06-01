import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const candidate = await User.findOne({ $or: [{ email }, { username }] });
    if (candidate) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (e) {
    res.status(500).json({ message: 'Registration error' });
  }
});

router.post('/login', async (req, res) => {
  console.log('BODY:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (e) {
    console.error(e); // <--- добавьте эту строку
    res.status(500).json({ message: 'Login error' });
  }
});


router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});
export default router;