import { Request, Response } from 'express';
import * as sessionsService from './sessions.service';
import { sendSuccess, sendError } from '../../utils/response';

export const createSession = async (req: Request, res: Response) => {
  const session = await sessionsService.createSession();
  return sendSuccess(res, 'Session created', { sessionId: session.id, createdAt: session.createdAt });
};

export const getSession = async (req: Request, res: Response) => {
  const session = await sessionsService.getSessionById(req.params.id);
  if (!session) return sendError(res, 'Session not found', 404);
  return sendSuccess(res, 'Session fetched', session);
};

export const uploadFinalImage = async (req: Request, res: Response) => {
  if (!req.file) return sendError(res, 'file is required', 400);

  try {
    const session = await sessionsService.uploadFinalImage(req.params.id, req.file);
    return sendSuccess(res, 'Final image uploaded', { finalImageUrl: session.finalImageUrl });
  } catch (err: any) {
    if (err.message === 'Session not found') return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const completeSession = async (req: Request, res: Response) => {
  const { templateId, finalImageUrl } = req.body;
  if (!templateId) return sendError(res, 'templateId is required', 400);

  try {
    const session = await sessionsService.completeSession(req.params.id, templateId, finalImageUrl);
    return sendSuccess(res, 'Session completed', session);
  } catch (err: any) {
    if (err.message === 'Session not found') return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    await sessionsService.deleteSession(req.params.id);
    return sendSuccess(res, 'Session deleted');
  } catch (err: any) {
    if (err.message === 'Session not found') return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};
