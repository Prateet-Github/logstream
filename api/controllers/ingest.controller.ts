import type { FastifyRequest, FastifyReply } from 'fastify';
import { producer } from '../lib/kafka.js';
import { logSchema } from '../schemas/log.schema.js';
import type { LogInput } from '../schemas/log.schema.js';

export const createLog = async (
  request: FastifyRequest<{ Body: LogInput }>, 
  reply: FastifyReply
) => {
  
  // 1. Validate
  const result = logSchema.safeParse(request.body);
  
  if (!result.success) {
    return reply.status(400).send({ 
      error: 'Validation Failed', 
      details: result.error.format() 
    });
  }

  const logData = result.data;

  try {
    // 2. Business Logic
    await producer.send({
      topic: 'app-logs',
      messages: [
        {
          value: JSON.stringify({
            ...logData,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    return reply.status(202).send({ status: 'queued', id: crypto.randomUUID() });

  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Failed to queue log' });
  }
};