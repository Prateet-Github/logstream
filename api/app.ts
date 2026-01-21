import Fastify from 'fastify';
import { healthRoute } from './routes/health.route.js';
import { ingestRoute } from './routes/ingest.route.js';

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(healthRoute, {
    prefix: '/api/health',
  });

  app.register(ingestRoute, {
    prefix: '/api/ingest',
  });

  return app;
};