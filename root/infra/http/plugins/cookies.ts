import cookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";

export async function CookiePlugin(app: FastifyInstance) {
  app.register(cookie, {
    secret: process.env.COOKIE_SECRET as string,
  });
}
