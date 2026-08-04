import "dotenv/config";
import fastify from "fastify";
import formbody from "@fastify/formbody";
import { Route } from "./routes.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { ErrorHandle } from "../error/errorHandle.js";

const App = fastify({ logger: true });

App.register(formbody);
App.register(cors, {
  origin: true,
  credentials: true,
});
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
App.register(ErrorHandle);

App.register(Route);

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
