import Fastify from 'fastify';
import { healthRoute } from './routes/health.route.js';
import { ingestRoute } from './routes/ingest.route.js';
import {env} from './config/env.js';

const isDev = env.NODE_ENV !== 'production';

export const buildApp = () => {
   const app = Fastify({
    logger: isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss',
              colorize: true,
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
  });

  app.register(healthRoute, {
    prefix: '/api/health',
  });

  app.register(ingestRoute, {
    prefix: '/api/ingest',
  });

  return app;
};