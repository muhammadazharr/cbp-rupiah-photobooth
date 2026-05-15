import cron from 'node-cron';
import prisma from '../config/database';
import cloudinary from '../config/cloudinary';
import logger from '../utils/logger';

export const runCleanupJob = async () => {
  logger.info('Starting cleanup job...');
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsToDelete = await prisma.session.findMany({
    where: {
      OR: [
        { status: 'COMPLETED' },
        { status: 'EXPIRED' }
      ],
      createdAt: { lt: thirtyDaysAgo }
    },
    include: { photos: true }
  });

  let sessionsDeleted = 0;
  let photosDeleted = 0;
  let errors: string[] = [];

  for (const session of sessionsToDelete) {
    try {
      // Delete from Cloudinary
      for (const photo of session.photos) {
        if (photo.rawImageUrl) {
          const parts = photo.rawImageUrl.split('/');
          const filename = parts.pop()?.split('.')[0];
          const folder = parts.slice(parts.indexOf('snapbooth')).join('/');
          if (folder && filename) {
            await cloudinary.uploader.destroy(`${folder}/${filename}`).catch(e => {
              errors.push(`Cloudinary delete error for ${photo.id}: ${e.message}`);
            });
            photosDeleted++;
          }
        }
      }

      await prisma.session.delete({ where: { id: session.id } });
      sessionsDeleted++;
    } catch (e: any) {
      errors.push(`Error deleting session ${session.id}: ${e.message}`);
    }
  }

  const logEntry = {
    executedAt: new Date(),
    sessionsDeleted,
    photosDeleted,
    errors
  };

  logger.info(`Cleanup finished. Deleted ${sessionsDeleted} sessions and ${photosDeleted} photos.`);

  // Save log
  const config = await prisma.appConfig.findUnique({ where: { key: 'cleanup_logs' } });
  const logs = config?.value ? JSON.parse(config.value) : [];
  logs.push(logEntry);
  if (logs.length > 50) logs.shift(); // Keep last 50 logs

  await prisma.appConfig.upsert({
    where: { key: 'cleanup_logs' },
    update: { value: JSON.stringify(logs) },
    create: { key: 'cleanup_logs', value: JSON.stringify(logs) }
  });
};

// 0 0 1 * * -> 1st of every month at midnight
cron.schedule('0 0 1 * *', () => {
  runCleanupJob().catch(e => logger.error('Scheduled cleanup job failed', e));
});
