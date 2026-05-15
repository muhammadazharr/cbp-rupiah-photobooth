import express from 'express';
import { getTemplates, getTemplate, createTemplate, updateTemplate, deleteTemplate, toggleTemplate } from './templates.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { upload } from '../../middleware/upload';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(getTemplates));
router.get('/:id', asyncHandler(getTemplate));
router.post('/', verifyToken, adminOnly, upload.single('thumbnail'), asyncHandler(createTemplate));
router.patch('/:id', verifyToken, adminOnly, upload.single('thumbnail'), asyncHandler(updateTemplate));
router.delete('/:id', verifyToken, adminOnly, asyncHandler(deleteTemplate));
router.patch('/:id/toggle', verifyToken, adminOnly, asyncHandler(toggleTemplate));

export default router;
