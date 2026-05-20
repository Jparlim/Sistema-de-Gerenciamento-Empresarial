import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export async function CorsPlugin(app: FastifyInstance) {
  app.register(cors, { origin: "http://localhost:5173", credentials: true });
}
