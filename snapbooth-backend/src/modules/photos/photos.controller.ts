import { Request, Response } from 'express';
import * as photosService from './photos.service';
import { sendSuccess, sendError } from '../../utils/response';

export const uploadPhoto = async (req: Request, res: Response) => {
  const { sessionId, photoNumber } = req.body;
  if (!sessionId || !photoNumber) return sendError(res, 'sessionId and photoNumber are required', 400);
  if (!req.file) return sendError(res, 'file is required', 400);

  const num = parseInt(photoNumber);
  if (num < 1 || num > 4) return sendError(res, 'photoNumber must be between 1 and 4', 400);

  try {
    const photo = await photosService.uploadPhoto(sessionId, num, req.file);
    return sendSuccess(res, 'Photo uploaded', { photoId: photo.id, rawImageUrl: photo.rawImageUrl });
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const retakePhoto = async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'file is required', 400);

  try {
    const photo = await photosService.retakePhoto(req.params.id, req.file);
    return sendSuccess(res, 'Photo retaken', photo);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const applyFilter = async (req: Request, res: Response) => {
  const { filterId } = req.body;
  if (!filterId) return sendError(res, 'filterId is required', 400);

  try {
    const photo = await photosService.applyFilter(req.params.id, filterId);
    return sendSuccess(res, 'Filter applied', photo);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const getPhoto = async (req: Request, res: Response) => {
  const photo = await photosService.getPhotoById(req.params.id);
  if (!photo) return sendError(res, 'Photo not found', 404);
  return sendSuccess(res, 'Photo fetched', photo);
};

export const getSessionPhotos = async (req: Request, res: Response) => {
  const photos = await photosService.getSessionPhotos(req.params.sessionId);
  return sendSuccess(res, 'Photos fetched', photos);
};
