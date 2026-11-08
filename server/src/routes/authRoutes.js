import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
router.post('/login', loginLimiter, login);
router.get('/me', requireAuth, me);
export default router;
