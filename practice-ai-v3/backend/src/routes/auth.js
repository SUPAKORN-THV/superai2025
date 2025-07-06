import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect(['student', 'admin']), me);
export default router;
