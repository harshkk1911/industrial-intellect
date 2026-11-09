
import { Router } from 'express';
import {
  getPublicContent,
  listPublicContent
} from '../controllers/contentController.js';

const router = Router();

// Public routes
router.get('/', listPublicContent);
router.get('/:slug', getPublicContent);

export default router;
