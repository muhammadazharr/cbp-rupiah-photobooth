import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { Readable } from 'stream';

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const createSession = async () => {
  return prisma.session.create({
    data: { status: 'IN_PROGRESS' },
  });
};

export const getSessionById = async (id: string) => {
  return prisma.session.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { photoNumber: 'asc' } },
      template: true,
    },
  });
};

export const uploadFinalImage = async (id: string, file: Express.Multer.File) => {
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) throw new Error('Session not found');
  
  const folder = `snapbooth/sessions/${id}/final`;
  const result = await uploadToCloudinary(file.buffer, folder);

  return prisma.session.update({
    where: { id },
    data: { finalImageUrl: result.secure_url },
  });
};

export const completeSession = async (id: string, templateId: string, finalImageUrl?: string) => {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!session) throw new Error('Session not found');
  if (session.status !== 'IN_PROGRESS') throw new Error('Session is not in progress');

  // Check if all 4 photos are uploaded
  const finalPhotos = session.photos.filter((p) => p.isFinal);
  if (finalPhotos.length < 4) {
    throw new Error('Cannot complete session unless all 4 photos have been uploaded');
  }

  return prisma.session.update({
    where: { id },
    data: {
      templateId,
      finalImageUrl: finalImageUrl || session.finalImageUrl,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });
};

export const deleteSession = async (id: string) => {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!session) throw new Error('Session not found');

  // Delete all photos from Cloudinary
  for (const photo of session.photos) {
    if (photo.rawImageUrl) {
      const parts = photo.rawImageUrl.split('/');
      const filename = parts.pop()?.split('.')[0];
      const folder = parts.slice(parts.indexOf('snapbooth')).join('/');
      if (folder && filename) {
        await cloudinary.uploader.destroy(`${folder}/${filename}`).catch(() => {});
      }
    }
  }

  if (session.finalImageUrl) {
    const parts = session.finalImageUrl.split('/');
    const filename = parts.pop()?.split('.')[0];
    const folder = parts.slice(parts.indexOf('snapbooth')).join('/');
    if (folder && filename) {
      await cloudinary.uploader.destroy(`${folder}/${filename}`).catch(() => {});
    }
  }

  return prisma.session.delete({ where: { id } });
};
