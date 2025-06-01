import express from 'express';
import auth from '../middlewares/auth.js';
import { getMe, updateMe, deleteMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.delete('/me', auth, deleteMe);

export default router;