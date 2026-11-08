import { Router } from 'express';
import { getPublicContent, listPublicContent } from '../controllers/contentController.js';

const router = Router();
router.get('/', listPublicContent);
router.get('/:slug', getPublicContent);
export default router;
