import { FastifyInstance } from "fastify";
import { ControllerIA } from "./Controller.js";

export function IA_Route(app: FastifyInstance) {
  app.post("/ia", ControllerIA.CreateController);
  app.delete("/ia/:id", ControllerIA.DeleteController);
  app.get("/ia", ControllerIA.FindAllController);
}
