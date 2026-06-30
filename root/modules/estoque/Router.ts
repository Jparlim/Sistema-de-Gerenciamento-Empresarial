import { FastifyInstance } from "fastify";
import { ControllerClient } from "./Controller.js";

export function Estoque_Route(app: FastifyInstance) {
  app.get("/estoque", ControllerClient.CreateController);
  app.get("/estoque", ControllerClient.UpdateController);
  app.get("/estoque", ControllerClient.DeleteController);
  app.get("/estoque", ControllerClient.FindAllController);
  app.get("/estoque", ControllerClient.FindByIdController);
}
