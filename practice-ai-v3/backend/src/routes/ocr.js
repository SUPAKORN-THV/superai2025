import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';
import { ocrUpload } from '../controllers/ocrController.js';

const router = Router();
router.post('/', protect(['student', 'admin']), upload.single('file'), ocrUpload);
export default router;