import  { Kafka } from "kafkajs";
import type { Producer } from "kafkajs";
import { env } from "../config/env.js";

// 1. Initialize Kafka Client
const kafka = new Kafka({
  clientId: "logstream-api",
  brokers: [env.KAFKA_BROKER],
});

// 2. Create Producer
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