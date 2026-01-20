import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { connectKafka } from "./lib/kafka.js";

const start = async () => {
  const app = buildApp();

  try {
    await connectKafka(app);
    console.log("Kafka Producer connected");
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();