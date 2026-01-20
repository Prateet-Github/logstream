import Fastify from 'fastify';
import { healthRoute } from './routes/health.route.js';

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(healthRoute, {
    prefix: '/api/health',
  });

  return app;
};