import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { getStats } from '../controllers/adminController.js';

const router = Router();
router.get('/stats', protect(['admin']), getStats);
export default router;