import { FastifyInstance } from "fastify";
import { ControllerClient } from "./Controller.js";

export function Cliente_Route(app: FastifyInstance) {
  app.post("/client", ControllerClient.CreateController);
  app.delete("/client/:id", ControllerClient.DeleteController);
  app.put("/client/:id", ControllerClient.UpdateController);
  app.get("/client", ControllerClient.FindAllController);
  app.get("/client/:id", ControllerClient.FindByIdController);
}
