
import { Router } from 'express';

import {
  createContent,
  dashboard,
  deleteContent,
  updateContent,
  listAdminContent
} from '../controllers/contentController.js';

import {
  allowRoles,
  requireAuth
} from '../middleware/auth.js';

const router = Router();

// All routes below require admin authentication
router.use(requireAuth);

// Dashboard statistics
router.get(
  '/dashboard',
  allowRoles('super_admin', 'content_admin', 'editor'),
  dashboard
);

// Get all videos, including drafts
router.get(
  '/content',
  allowRoles('super_admin', 'content_admin', 'editor'),
  listAdminContent
);

// Add new video
router.post(
  '/content',
  allowRoles('super_admin', 'content_admin', 'editor'),
  createContent
);

// Edit video
router.patch(
  '/content/:id',
  allowRoles('super_admin', 'content_admin', 'editor'),
  updateContent
);

// Delete video
router.delete(
  '/content/:id',
  allowRoles('super_admin', 'content_admin'),
  deleteContent
);

export default router;
