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

const destroyCloudinaryImage = async (url: string) => {
  try {
    const parts = url.split('/');
    const filename = parts.pop()?.split('.')[0];
    const folder = parts.slice(parts.indexOf('snapbooth')).join('/');
    if (folder && filename) {
      await cloudinary.uploader.destroy(`${folder}/${filename}`);
    }
  } catch (error) {
    // Ignore error
  }
};

export const uploadPhoto = async (sessionId: string, photoNumber: number, file: Express.Multer.File) => {
  const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { photos: true } });
  if (!session) throw new Error('Session not found');
  if (session.status !== 'IN_PROGRESS') throw new Error('Session is not in progress');

  const existingPhoto = session.photos.find(p => p.photoNumber === photoNumber && p.isFinal);
  if (existingPhoto) throw new Error(`Photo ${photoNumber} already uploaded`);

  const folder = `snapbooth/sessions/${sessionId}/photo_${photoNumber}`;
  const result = await uploadToCloudinary(file.buffer, folder);

  return prisma.photo.create({
    data: {
      sessionId,
      photoNumber,
      rawImageUrl: result.secure_url,
      isFinal: true,
    },
  });
};

export const retakePhoto = async (photoId: string, file: Express.Multer.File) => {
  const photo = await prisma.photo.findUnique({ where: { id: photoId }, include: { session: true } });
  if (!photo) throw new Error('Photo not found');
  if (photo.session.status !== 'IN_PROGRESS') throw new Error('Session is not in progress');
  if (photo.retakeCount >= 3) throw new Error('Maximum retakes reached');

  // Delete old from Cloudinary
  if (photo.rawImageUrl) {
    await destroyCloudinaryImage(photo.rawImageUrl);
  }

  const folder = `snapbooth/sessions/${photo.sessionId}/photo_${photo.photoNumber}`;
  const result = await uploadToCloudinary(file.buffer, folder);

  return prisma.photo.update({
    where: { id: photoId },
    data: {
      rawImageUrl: result.secure_url,
      retakeCount: { increment: 1 },
      isFinal: true,
    },
  });
};

export const applyFilter = async (photoId: string, filterId: string) => {
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) throw new Error('Photo not found');

  const filter = await prisma.filter.findUnique({ where: { id: filterId } });
  if (!filter) throw new Error('Filter not found');

  return prisma.photo.update({
    where: { id: photoId },
    data: { filterId },
    include: { filter: true },
  });
};

export const getPhotoById = async (id: string) => {
  return prisma.photo.findUnique({
    where: { id },
    include: { filter: true },
  });
};

export const getSessionPhotos = async (sessionId: string) => {
  return prisma.photo.findMany({
    where: { sessionId },
    orderBy: { photoNumber: 'asc' },
    include: { filter: true },
  });
};
