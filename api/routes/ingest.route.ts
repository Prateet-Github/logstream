import type { FastifyInstance } from 'fastify';
import { createLog } from '../controllers/ingest.controller.js';
import { getLogs } from '../controllers/logs.controller.js';

export async function ingestRoute(fastify: FastifyInstance) {
  fastify.post('/', createLog);
  fastify.get('/logs', getLogs);

}