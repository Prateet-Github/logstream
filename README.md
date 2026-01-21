# LogStream API

![CI Status](https://github.com/prateettiwari/logstream/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A high-performance, async log ingestion service built with **Node.js**, **Fastify**, and **Kafka**. 

This service acts as the entry point for a distributed logging architecture. It validates incoming logs with high throughput and produces them to a Kafka topic for downstream processing (ClickHouse).

## Key Features

- **High Performance:** Built on [Fastify](https://www.fastify.io/), one of the fastest Node.js frameworks.
- **Type Safety:** 100% TypeScript codebase with strict configuration.
- **Data Validation:** Runtime request validation using [Zod](https://zod.dev/).
- **Clean Architecture:** Separation of concerns (Controllers, Services, Routes, Schemas).
- **Event-Driven:** Asynchronous log processing via Apache Kafka.

## Tech Stack

- **Runtime:** Node.js 
- **Framework:** Fastify
- **Language:** TypeScript
- **Message Broker:** Apache Kafka (KafkaJS)
- **Database:** ClickHouse
- **Validation:** Zod
- **Dev Tools:** Nodemon, TSX, ESLint

## Architecture

Data flows through the system in three stages:

1.  **Ingestion:** The Fastify API accepts logs, validates them with Zod, and pushes them to a **Kafka** topic (`app-logs`).
2.  **Buffering:** Kafka acts as a shock absorber, handling high-throughput spikes without slowing down the API.
3.  **Storage:** A separate worker service consumes messages from Kafka and batch-inserts them into **ClickHouse** for real-time analytics.