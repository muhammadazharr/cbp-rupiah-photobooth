import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. One default admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
    },
  });

  // 2. Default AppConfig entries
  const configs = [
    { key: 'camera_source', value: 'laptop' },
    { key: 'whatsapp_default_message', value: 'Hai! Berikut adalah hasil foto booth kamu 📸✨ Simpan dan bagikan kenangan indah ini! {imageUrl}' },
    { key: 'printer_ip', value: '192.168.1.100' },
    { key: 'printer_port', value: '631' },
    { key: 'cleanup_logs', value: '[]' },
  ];

  for (const config of configs) {
    await prisma.appConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  // 3. Five default filters
  const filters = [
    { name: 'Original', cssFilter: 'none' },
    { name: 'Warm Tone', cssFilter: 'sepia(0.3) saturate(1.4) brightness(1.05)' },
    { name: 'Cool Tone', cssFilter: 'hue-rotate(180deg) saturate(0.8) brightness(1.1)' },
    { name: 'B&W Classic', cssFilter: 'grayscale(1) contrast(1.1)' },
    { name: 'Vintage', cssFilter: 'sepia(0.5) contrast(0.85) brightness(0.95) saturate(0.9)' },
  ];

  for (const filter of filters) {
    const existing = await prisma.filter.findFirst({ where: { name: filter.name } });
    if (!existing) {
      await prisma.filter.create({ data: filter });
    }
  }

  // 4. Three default templates
  const templates = [
    { name: 'Classic White', thumbnailUrl: 'https://via.placeholder.com/150', frameColor: '#ffffff', bgColor: '#f5f5f5', borderWidth: 10, textColor: '#ffffff' },
    { name: 'Midnight Black', thumbnailUrl: 'https://via.placeholder.com/150', frameColor: '#1a1a1a', bgColor: '#000000', borderWidth: 10, textColor: '#ffffff' },
    { name: 'Rose Gold', thumbnailUrl: 'https://via.placeholder.com/150', frameColor: '#e8b4a0', bgColor: '#fdf0ed', borderWidth: 12, textColor: '#8b5e52' },
  ];

  for (const template of templates) {
    const existing = await prisma.template.findFirst({ where: { name: template.name } });
    if (!existing) {
      await prisma.template.create({ data: template });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
