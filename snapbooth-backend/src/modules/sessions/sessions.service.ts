import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';

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

export const completeSession = async (id: string, templateId: string) => {
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

  // Set finalImageUrl (assuming the frontend composite will happen or we just set it later,
  // but wait, the spec says "finalImageUrl must be set before print or whatsapp".
  // The frontend might generate the composite and upload it? Or does the backend do it?
  // The spec says "PATCH /:id/complete -> body: { templateId }, set status COMPLETED".
  // Let's assume frontend will upload the final image later or we just set it completed.
  // Actually, wait, "finalImageUrl must be set before print or whatsapp can be called".
  // If the frontend composites it, they might upload it.
  // For now, let's just set it completed.

  return prisma.session.update({
    where: { id },
    data: {
      templateId,
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
      // extract public id
      const parts = photo.rawImageUrl.split('/');
      const filename = parts.pop()?.split('.')[0];
      const folder = parts.slice(parts.indexOf('snapbooth')).join('/');
      if (folder && filename) {
        await cloudinary.uploader.destroy(`${folder}/${filename}`).catch(() => {});
      }
    }
  }

  return prisma.session.delete({ where: { id } });
};
