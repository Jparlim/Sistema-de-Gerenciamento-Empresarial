import "dotenv/config";
import fastify from "fastify";
import formbody from "@fastify/formbody";
import { Route } from "./routes.js";

const App = fastify({ logger: true });

App.register(formbody);
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
