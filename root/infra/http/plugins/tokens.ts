import { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";
import "dotenv/config";

export function TokensPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });
  app.register(jwt, {
    secret: process.env.JWT_REFRESH_SECRET as string,
    namespace: "refresh",
  });
}
