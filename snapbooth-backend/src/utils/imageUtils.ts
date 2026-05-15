import sharp from 'sharp';

export const prepareForPrint = async (imageBuffer: Buffer): Promise<Buffer> => {
  // Target: 4x6 inches at 300dpi -> 1200x1800 px
  return sharp(imageBuffer)
    .resize(1200, 1800, { fit: 'cover' })
    .jpeg({ quality: 100 })
    .toBuffer();
};
