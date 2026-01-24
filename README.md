# LogStream

![CI Status](https://github.com/Prateet-Github/logstream/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

A high-performance, distributed log ingestion and analytics platform built with **Node.js**, **Kafka**, and **ClickHouse**.

LogStream is designed to handle high-throughput log data by decoupling ingestion from storage. It validates logs via a high-speed API, buffers them in Kafka (KRaft mode), and efficiently batch-writes them to ClickHouse for real-time querying.

## Key Features

-   **High Performance API:** Built on [Fastify](https://www.fastify.io/) for low-overhead HTTP ingestion.
-   **Event-Driven Architecture:** Uses **Apache Kafka** (running in KRaft mode, no Zookeeper) to decouple producers from consumers.
-   **OLAP Storage:** Stores data in **ClickHouse**, optimized for analytical queries and massive scale.
-   **Batch Processing:** A dedicated worker service consumes Kafka messages and bulk-inserts them into the database for efficiency.
-   **Type Safety:** 100% TypeScript codebase with runtime validation using [Zod](https://zod.dev/).
-   **Production Ready:** Fully dockerized environment with "Hybrid Mode" support for local development.

## Tech Stack

-   **Runtime:** Node.js
-   **Language:** TypeScript
-   **API Framework:** Fastify
-   **Message Broker:** Apache Kafka (KafkaJS)
-   **Database:** ClickHouse
-   **Validation:** Zod
-   **Infrastructure:** Docker & Docker Compose

## Architecture

The system consists of four distinct components running in a Docker network:

1.  **LogStream API:** Accepts HTTP POST requests, validates the payload (Level, Service, Message), and produces a message to the Kafka topic `app-logs`.
2.  **Kafka (KRaft):** Acts as the high-throughput buffer/queue.
3.  **LogStream Worker:** A background service that consumes messages from Kafka in batches and inserts them into ClickHouse.
4.  **ClickHouse:** The columnar database where logs are stored and queried.

```mermaid
graph LR
    A[Client/App] -->|POST /ingest| B(Fastify API)
    B -->|Produce| C{Kafka Topic}
    C -->|Consume Batch| D[Worker Service]
    D -->|Insert| E[(ClickHouse DB)]

⚡ Quick Start
Prerequisites

Docker & Docker Compose installed

Node.js (v18+)

1. Run Everything (Production Mode)

To spin up the entire stack (Infrastructure + Code) inside Docker:

# Start all services
docker-compose up --build -d

# Check status
docker-compose ps

2. Hybrid Mode (Recommended for Dev)

Run infrastructure in Docker, but run the API/Worker code locally on your machine for fast debugging.

Step A: Start Infrastructure Only

# Starts Kafka and ClickHouse only
docker-compose up -d kafka clickhouse

Step B: Run API Locally

cd api
npm install
npm run dev
# Server listens on http://localhost:3000

Step C: Run Worker Locally

# Open a new terminal
cd api
npx tsx worker/index.ts

📡 API Usage
1. Ingest a Log

Send a log entry to the system.

Endpoint: POST /api/ingest Headers: Content-Type: application/json

curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "service": "user-service",
    "level": "INFO",
    "message": "User login successful"
  }'

  Note: The level field accepts: INFO, WARN, ERROR, DEBUG, FATAL

  2. Query Logs

Retrieve logs directly from ClickHouse.

Endpoint: GET /api/ingest/logs

# Get all logs
curl http://localhost:3000/api/ingest/logs

# Filter by service
curl "http://localhost:3000/api/ingest/logs?service=user-service"

📄 License
This project is licensed under the MIT License.