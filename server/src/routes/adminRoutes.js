import { Router } from 'express';
import { createContent, dashboard, deleteContent, updateContent } from '../controllers/contentController.js';
import { allowRoles, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/dashboard', allowRoles('super_admin', 'content_admin', 'editor'), dashboard);
router.post('/content', allowRoles('super_admin', 'content_admin', 'editor'), createContent);
router.patch('/content/:id', allowRoles('super_admin', 'content_admin', 'editor'), updateContent);
router.delete('/content/:id', allowRoles('super_admin', 'content_admin', 'editor'), deleteContent);
export default router;
