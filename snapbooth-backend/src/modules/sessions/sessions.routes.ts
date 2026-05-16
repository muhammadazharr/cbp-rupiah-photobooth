import express from 'express';
import { createSession, getSession, completeSession, deleteSession, uploadFinalImage } from './sessions.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';
import { upload } from '../../middleware/upload';

const router = express.Router();

router.post('/', asyncHandler(createSession));
router.get('/:id', asyncHandler(getSession));
router.post('/:id/final-image', upload.single('file'), asyncHandler(uploadFinalImage));
router.patch('/:id/complete', asyncHandler(completeSession));
router.delete('/:id', verifyToken, adminOnly, asyncHandler(deleteSession));

export default router;
