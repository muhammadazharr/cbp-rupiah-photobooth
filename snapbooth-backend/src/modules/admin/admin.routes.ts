import express from 'express';
import { getSessions, getAnalytics, getCameraConfig, updateCameraConfig, triggerCleanup, getCleanupLogs } from './admin.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.use(verifyToken, adminOnly);

router.get('/sessions', asyncHandler(getSessions));
router.get('/analytics', asyncHandler(getAnalytics));
router.get('/config/camera', asyncHandler(getCameraConfig));
router.patch('/config/camera', asyncHandler(updateCameraConfig));
router.post('/cleanup', asyncHandler(triggerCleanup));
router.get('/cleanup/logs', asyncHandler(getCleanupLogs));

export default router;
