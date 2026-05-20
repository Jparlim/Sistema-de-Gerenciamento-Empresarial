import { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";

export async function TokensPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });
  app.register(jwt, {
    secret: process.env.JWT_REFRESH_SECRET as string,
    namespace: "refresh",
  });
}
