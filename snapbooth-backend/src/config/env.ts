import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('8h'),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  FONNTE_API_KEY: z.string().optional(),
  PRINTER_IP: z.string(),
  PRINTER_PORT: z.string().default('631'),
  ALLOWED_ORIGIN: z.string().default('http://localhost:3000'),
  ADMIN_DEFAULT_USERNAME: z.string().default('admin'),
  ADMIN_DEFAULT_PASSWORD: z.string().default('admin123'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format());
  process.exit(1);
}

export default _env.data;
