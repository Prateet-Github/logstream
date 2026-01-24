import { createClient } from "@clickhouse/client";
import { env } from "../config/env.js";

export const clickhouse = createClient({
  url: env.CLICKHOUSE_HOST,
  username: 'default',
  password: env.CLICKHOUSE_PASSWORD,
  database: 'default',
});

export const connectClickHouse = async () => {
  try {
    
    await clickhouse.ping();
    console.log('Connected to ClickHouse successfully.');

    await clickhouse.command({
      query: `
        CREATE TABLE IF NOT EXISTS app_logs (
          id UUID,
          service String,
          level String,
          message String,
          meta String, -- We will store the JSON object as a string for now
          timestamp DateTime64(3)
        ) ENGINE = MergeTree()
        ORDER BY timestamp
      `,
    });
    console.log('Log Table Verified');

  } catch (error) {
    console.error('ClickHouse connection error:', error);
    process.exit(1);
  }
};