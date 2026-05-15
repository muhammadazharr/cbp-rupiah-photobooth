import { Request, Response } from 'express';
import * as adminService from './admin.service';
import { sendSuccess, sendPagination, sendError } from '../../utils/response';
import { runCleanupJob } from '../../jobs/cleanup.job';
import prisma from '../../config/database';

export const getSessions = async (req: Request, res: Response) => {
  const { page = '1', limit = '20', status, startDate, endDate } = req.query;

  const filters: any = {};
  if (status) filters.status = status;
  if (startDate && endDate) {
    filters.createdAt = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string),
    };
  }

  const result = await adminService.getSessions(filters, parseInt(page as string), parseInt(limit as string));
  return sendPagination(res, 'Sessions fetched', result.data, result.pagination);
};

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics();
  return sendSuccess(res, 'Analytics fetched', analytics);
};

export const getCameraConfig = async (req: Request, res: Response) => {
  const config = await prisma.appConfig.findUnique({ where: { key: 'camera_source' } });
  let data = { cameraSource: 'laptop' };
  if (config?.value) {
    try {
      data = JSON.parse(config.value);
    } catch (e) {
      data = { cameraSource: config.value };
    }
  }
  return sendSuccess(res, 'Camera config fetched', data);
};

export const updateCameraConfig = async (req: Request, res: Response) => {
  const { cameraSource, deviceId } = req.body;
  if (!cameraSource) return sendError(res, 'cameraSource is required', 400);

  const value = JSON.stringify({ cameraSource, deviceId });

  await prisma.appConfig.upsert({
    where: { key: 'camera_source' },
    update: { value },
    create: { key: 'camera_source', value },
  });

  return sendSuccess(res, 'Camera config updated');
};

export const triggerCleanup = async (req: Request, res: Response) => {
  try {
    await runCleanupJob();
    return sendSuccess(res, 'Cleanup job triggered');
  } catch (error: any) {
    return sendError(res, 'Failed to trigger cleanup: ' + error.message, 500);
  }
};

export const getCleanupLogs = async (req: Request, res: Response) => {
  const config = await prisma.appConfig.findUnique({ where: { key: 'cleanup_logs' } });
  const logs = config?.value ? JSON.parse(config.value) : [];
  return sendSuccess(res, 'Cleanup logs fetched', logs.slice(-10));
};
