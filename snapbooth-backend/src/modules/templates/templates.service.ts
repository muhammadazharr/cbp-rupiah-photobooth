import prisma from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { Readable } from 'stream';

const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(buffer).pipe(uploadStream);
  });
};

export const getTemplates = async () => {
  return prisma.template.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
};

export const getTemplateById = async (id: string) => {
  return prisma.template.findUnique({ where: { id } });
};

export const createTemplate = async (data: any, file?: Express.Multer.File) => {
  let thumbnailUrl = data.thumbnailUrl;
  
  if (file) {
    const result = await uploadToCloudinary(file.buffer, 'snapbooth/templates');
    thumbnailUrl = result.secure_url;
  }

  return prisma.template.create({
    data: {
      name: data.name,
      description: data.description,
      thumbnailUrl,
      frameColor: data.frameColor,
      bgColor: data.bgColor,
      borderWidth: data.borderWidth ? parseInt(data.borderWidth) : undefined,
      borderRadius: data.borderRadius ? parseInt(data.borderRadius) : undefined,
      textLabel: data.textLabel,
      textColor: data.textColor,
      fontFamily: data.fontFamily,
    },
  });
};

export const updateTemplate = async (id: string, data: any, file?: Express.Multer.File) => {
  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) throw new Error('Template not found');

  let thumbnailUrl = existing.thumbnailUrl;
  if (file) {
    const result = await uploadToCloudinary(file.buffer, 'snapbooth/templates');
    thumbnailUrl = result.secure_url;
  } else if (data.thumbnailUrl) {
    thumbnailUrl = data.thumbnailUrl;
  }

  return prisma.template.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      thumbnailUrl,
      frameColor: data.frameColor,
      bgColor: data.bgColor,
      borderWidth: data.borderWidth ? parseInt(data.borderWidth) : undefined,
      borderRadius: data.borderRadius ? parseInt(data.borderRadius) : undefined,
      textLabel: data.textLabel,
      textColor: data.textColor,
      fontFamily: data.fontFamily,
    },
  });
};

export const deleteTemplate = async (id: string) => {
  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) throw new Error('Template not found');

  return prisma.template.update({
    where: { id },
    data: { isActive: false },
  });
};

export const toggleTemplate = async (id: string) => {
  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) throw new Error('Template not found');

  return prisma.template.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
};
