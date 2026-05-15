import prisma from '../../config/database';
import env from '../../config/env';
import axios from 'axios';
import FormData from 'form-data';

const normalizePhoneNumber = (phone: string) => {
  let normalized = phone.replace(/\D/g, '');
  if (normalized.startsWith('0')) {
    normalized = '62' + normalized.substring(1);
  } else if (normalized.startsWith('8')) {
    normalized = '62' + normalized;
  }

  if (!normalized.startsWith('62') || normalized.length < 10 || normalized.length > 14) {
    throw new Error('Invalid phone number format');
  }

  return normalized;
};

export const sendWhatsapp = async (sessionId: string, phoneNumber: string) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error('Session not found');
  if (!session.finalImageUrl) throw new Error('finalImageUrl is not set');

  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  const config = await prisma.appConfig.findUnique({ where: { key: 'whatsapp_default_message' } });
  let messageText = config?.value || 'Hai! Berikut adalah hasil foto booth kamu 📸✨ {imageUrl}';
  messageText = messageText.replace('{imageUrl}', session.finalImageUrl);

  const waLink = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(messageText)}`;

  const waSendRecord = await prisma.whatsappSend.create({
    data: {
      sessionId,
      phoneNumber: normalizedPhone,
      imageUrl: session.finalImageUrl,
      waLink,
      status: env.FONNTE_API_KEY ? 'PENDING' : 'SENT',
      sentAt: env.FONNTE_API_KEY ? null : new Date(),
    },
  });

  if (env.FONNTE_API_KEY) {
    setImmediate(async () => {
      try {
        const formData = new FormData();
        formData.append('target', normalizedPhone);
        formData.append('message', messageText);
        formData.append('url', session.finalImageUrl!); // Attachment

        await axios.post('https://api.fonnte.com/send', formData, {
          headers: {
            Authorization: env.FONNTE_API_KEY,
            ...formData.getHeaders(),
          },
        });

        await prisma.whatsappSend.update({
          where: { id: waSendRecord.id },
          data: { status: 'SENT', sentAt: new Date() },
        });
      } catch (error) {
        await prisma.whatsappSend.update({
          where: { id: waSendRecord.id },
          data: { status: 'FAILED' },
        });
      }
    });
  }

  return { waLink, sendId: waSendRecord.id, status: waSendRecord.status };
};
