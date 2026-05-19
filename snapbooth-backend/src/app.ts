import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';

import authRoutes from './modules/auth/auth.routes';
import sessionRoutes from './modules/sessions/sessions.routes';
import photoRoutes from './modules/photos/photos.routes';
import templateRoutes from './modules/templates/templates.routes';
import filterRoutes from './modules/filters/filters.routes';
import printRoutes from './modules/print/print.routes';
import whatsappRoutes from './modules/whatsapp/whatsapp.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// 1. PRIORITAS UTAMA: Load Swagger
const swaggerPath = path.join(__dirname, '../../openapi.yaml');
let swaggerDocument;
try {
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = YAML.load(swaggerPath);
  }
} catch (error) {
  console.error('Swagger load error:', error);
}

// 2. BYPASS SEMUA MIDDLEWARE UNTUK SWAGGER, ROOT & STATUS
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.get('/api-status', (req, res) => {
  res.json({
    success: true,
    message: 'SnapBooth API is running',
    data: {
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      docs: '/api-docs',
    },
  });
});

// 3. BARU PASANG SECURITY & LAINNYA UNTUK API
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  env.ALLOWED_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  `http://localhost:${env.PORT}`,
  `http://127.0.0.1:${env.PORT}`,
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate Limiter hanya untuk /api
app.use('/api', apiLimiter);

app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/print', printRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/admin', adminRoutes);

// 5. ERROR HANDLING
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;
