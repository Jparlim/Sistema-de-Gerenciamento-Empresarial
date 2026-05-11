import "dotenv/config";
import fastify from "fastify";
import { Route } from "./http/route.js";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

const App = fastify({ logger: true });

App.get("/health", async (request, reply) => {
  return { status: "ok", message: "Servidor rodando corretamente" };
});

App.register(Route);

App.register(cookie, {
  secret: process.env.COOKIE_SECRET as string,
});
App.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});
App.register(jwt, {
  secret: process.env.JWT_REFRESH_SECRET as string,
  namespace: "refresh",
});
App.register(cors, { origin: "http://localhost:5173", credentials: true });

const start = async () => {
  try {
    await App.listen({ port: 8888, host: "0.0.0.0" });
    console.log("✓ Servidor rodando em http://localhost:8888");
  } catch (error) {
    App.log.error(error);
    process.exit(1);
  }
};

start();
