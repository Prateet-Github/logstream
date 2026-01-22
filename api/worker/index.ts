import { Kafka } from 'kafkajs';
import { env } from '../config/env.js';
import { clickhouse, connectClickHouse } from '../lib/clickhouse.js';

const kafka = new Kafka({
  clientId: 'logstream-worker',
  brokers: [env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'log-processing-group-v3' });

const run = async () => {
  // connect to infrastructure
  await connectClickHouse();
  await consumer.connect();
  console.log('Worker connected to Kafka');

  await consumer.subscribe({ topic: 'app-logs', fromBeginning: true });

  // process messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const logString = message.value?.toString();
      
      if (!logString) return;


      try {
        const logData = JSON.parse(logString);

        // insert into clickHouse
        await clickhouse.insert({
          table: 'app_logs',
          values: [
            {
              id: logData.id || crypto.randomUUID(), // Fallback ID
              service: logData.service,
              level: logData.level,
              message: logData.message,
              meta: JSON.stringify(logData.meta || {}),
              timestamp: new Date(logData.timestamp).getTime(),
            },
          ],
          format: 'JSONEachRow',
        });

        console.log(`Inserted log from ${logData.service}`);

      } catch (err) {
        console.error('Error processing message:', err);
      }
    },
  });
};

run().catch(console.error);