import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { createQuestion, generateQuestions, listQuestions, evaluateAttempt } from '../controllers/questionController.js';

const router = Router();
router.post('/', protect(['admin']), createQuestion);
router.post('/generate', protect(['admin']), generateQuestions);
router.get('/', protect(['admin']), listQuestions);
router.post('/attempt', protect(['student', 'admin']), evaluateAttempt);
export default router;