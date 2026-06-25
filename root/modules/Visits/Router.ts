import { FastifyInstance } from "fastify";
import { Controller } from "./Controller.js";

export function Route_Visits(app: FastifyInstance) {
  app.get("/visit", Controller.FindAllController);
  app.post("/visit", Controller.CreateController);
  app.delete("/visit", Controller.DeleteController);
  app.get("/visit/:id", Controller.FindByIdController);
}
