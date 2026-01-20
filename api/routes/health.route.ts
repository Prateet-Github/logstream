import type { FastifyInstance } from "fastify";

export async function healthRoute(fastify: FastifyInstance) {
  fastify.get("/", async (request, reply) => {
    return { status: "ok" };
  });
}