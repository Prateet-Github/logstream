import  { Kafka } from "kafkajs";
import type { Producer } from "kafkajs";
import { env } from "../config/env.js";

const kafka = new Kafka({
  clientId: "logstream-api",
  brokers: [env.KAFKA_BROKER],
});

export const producer: Producer = kafka.producer();

import type { FastifyInstance } from "fastify";

export const connectKafka = async (app: FastifyInstance) => {
  try {
    app.log.info("Connecting to Kafka...");
    await producer.connect();
    app.log.info("Kafka producer connected");
  } catch (error) {
    app.log.error({ error }, "Kafka connection failed");
    process.exit(1);
  }
};