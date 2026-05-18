import sharp from 'sharp';

export const prepareForPrint = async (imageBuffer: Buffer): Promise<Buffer> => {
  // Target: 4x6 inches at 300dpi -> 1200x1800 px (Portrait)
  // We use 'contain' and white background to ensure the whole strip is visible
  return sharp(imageBuffer)
    .resize(1200, 1800, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .jpeg({ quality: 100 })
    .toBuffer();
};
