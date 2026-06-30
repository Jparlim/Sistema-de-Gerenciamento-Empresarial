import { FastifyInstance } from "fastify";
import { Controller } from "./Controller.js";

export function Visits_Route(app: FastifyInstance) {
  app.get("/visit", Controller.FindAllController);
  app.post("/visit", Controller.CreateController);
  app.delete("/visit/:id", Controller.DeleteController);
  app.get("/visit/:id", Controller.FindByIdController);
}
