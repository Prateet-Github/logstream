import type { FastifyRequest, FastifyReply } from 'fastify';
import { clickhouse } from '../lib/clickhouse.js';

export const getLogs = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await clickhouse.query({
      query: `
        SELECT *
        FROM app_logs
        ORDER BY timestamp DESC
        LIMIT 100
      `,
      format: 'JSONEachRow',
    });

    const logs = await result.json();

    return reply.send({
      status: 'success',
      data: logs,
    });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Failed to fetch logs' });
  }
};