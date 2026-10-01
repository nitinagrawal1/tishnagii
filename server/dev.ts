import 'dotenv/config';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer as createViteServer } from 'vite';
import { config as loadEnv } from 'dotenv';
import createOrderHandler from '../api/create-order';
import createCodOrderHandler from '../api/create-cod-order';
import verifyPaymentHandler from '../api/verify-payment';

loadEnv({ path: '.env.firebase' });

const start = async () => {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.post('/api/create-order', (request, response) =>
    createOrderHandler(request as VercelRequest, response as unknown as VercelResponse));
  app.post('/api/create-cod-order', (request, response) =>
    createCodOrderHandler(request as VercelRequest, response as unknown as VercelResponse));
  app.post('/api/verify-payment', (request, response) =>
    verifyPaymentHandler(request as VercelRequest, response as unknown as VercelResponse));

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Tishnagii dev server listening at http://localhost:${port}`);
  });
};

void start();