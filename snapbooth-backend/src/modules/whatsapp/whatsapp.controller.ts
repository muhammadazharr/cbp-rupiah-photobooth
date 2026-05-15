import { Request, Response } from 'express';
import * as whatsappService from './whatsapp.service';
import { sendSuccess, sendError } from '../../utils/response';
import prisma from '../../config/database';

export const sendWhatsapp = async (req: Request, res: Response) => {
  const { sessionId, phoneNumber } = req.body;
  if (!sessionId || !phoneNumber) return sendError(res, 'sessionId and phoneNumber are required', 400);

  try {
    const result = await whatsappService.sendWhatsapp(sessionId, phoneNumber);
    return sendSuccess(res, 'WhatsApp link generated', result);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const getConfig = async (req: Request, res: Response) => {
  const config = await prisma.appConfig.findUnique({ where: { key: 'whatsapp_default_message' } });
  return sendSuccess(res, 'WhatsApp config fetched', { defaultMessage: config?.value || '' });
};

export const updateConfig = async (req: Request, res: Response) => {
  const { defaultMessage } = req.body;
  if (!defaultMessage) return sendError(res, 'defaultMessage is required', 400);

  await prisma.appConfig.upsert({
    where: { key: 'whatsapp_default_message' },
    update: { value: defaultMessage },
    create: { key: 'whatsapp_default_message', value: defaultMessage },
  });

  return sendSuccess(res, 'WhatsApp config updated');
};
