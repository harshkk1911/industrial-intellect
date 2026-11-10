import { Router } from 'express';
import { getPublicContent, listPublicContent } from '../controllers/contentController.js';
import { viewResource } from '../controllers/resourceController.js';
const router = Router();
router.get('/resources/:id/view', viewResource);
router.get('/', listPublicContent);
router.get('/:slug', getPublicContent);
export default router;
