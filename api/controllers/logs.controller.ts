import type { FastifyRequest, FastifyReply } from 'fastify';
import { clickhouse } from '../lib/clickhouse.js';

interface LogQuery {
  service?: string;
  level?: string;
  limit?: string;
}

export const getLogs = async (
  request: FastifyRequest<{ Querystring: LogQuery }>,
  reply: FastifyReply
) => {

  const { limit = '100', service, level } = request.query;

  try {

    let query = `SELECT * FROM app_logs`;
    const queryParams: Record<string, unknown> = {
      limit: parseInt(limit),
    };
    const conditions: string[] = [];

    if (service) {
      conditions.push(`service = {service:String}`);
      queryParams.service = service;
    }

    if (level) {
      conditions.push(`level = {level:String}`);
      queryParams.level = level;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY timestamp DESC LIMIT {limit:UInt32}`;

    const result = await clickhouse.query({
      query,
      query_params: queryParams,
      format: 'JSONEachRow',
    });

    const logs = await result.json();

    return reply.send({
      status: 'success',
      result: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Failed to fetch logs' });
  }
};