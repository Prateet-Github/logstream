import { Kafka } from 'kafkajs';
import { env } from '../config/env.js';
import { clickhouse, connectClickHouse } from '../lib/clickhouse.js';
import crypto from 'node:crypto';

const kafka = new Kafka({
  clientId: 'logstream-worker',
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'log-processing-group-v3' });

const run = async () => {

  await connectClickHouse();
  await consumer.connect();
  console.log('Worker connected to Kafka');

  await consumer.subscribe({ topic: 'app-logs', fromBeginning: true });

  // swtiched to batch processing from single message processing for efficiency
  await consumer.run({
    eachBatchAutoResolve: true,
    eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
      const messages = batch.messages;
      
      if (messages.length === 0) return;

      console.log(`Processing batch of ${messages.length} messages...`);

      // Transform Kafka Messages to ClickHouse Rows
      const rows = messages.map((message) => {
        const logString = message.value?.toString();
        if (!logString) return null;

        try {
          const logData = JSON.parse(logString);
          return {
            id: logData.id || crypto.randomUUID(),
            service: logData.service,
            level: logData.level,
            message: logData.message,
            meta: JSON.stringify(logData.meta || {}),
            timestamp: new Date(logData.timestamp).getTime(),
          };
        } catch (err) {
          return null; 
        }
      }).filter(Boolean);

      if (rows.length === 0) return;

      try {
        // bulk Insert into ClickHouse 
        await clickhouse.insert({
          table: 'app_logs',
          values: rows,
          format: 'JSONEachRow',
        });

        // mark success
        await heartbeat(); 
        
        console.log(`committed ${rows.length} logs to ClickHouse`);

      } catch (err) {
        console.error('Batch Insert Failed:', err);
      }
    },
  });
};

run().catch(console.error);