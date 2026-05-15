import express from 'express';
import { uploadPhoto, retakePhoto, applyFilter, getPhoto, getSessionPhotos } from './photos.controller';
import { upload } from '../../middleware/upload';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/upload', upload.single('file'), asyncHandler(uploadPhoto));
router.patch('/:id/retake', upload.single('file'), asyncHandler(retakePhoto));
router.patch('/:id/filter', asyncHandler(applyFilter));
router.get('/:id', asyncHandler(getPhoto));
router.get('/session/:sessionId', asyncHandler(getSessionPhotos));

export default router;
