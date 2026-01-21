import type { FastifyInstance } from 'fastify';
import { createLog } from '../controllers/ingest.controller.js';

export async function ingestRoute(fastify: FastifyInstance) {
  fastify.post('/', createLog);
}