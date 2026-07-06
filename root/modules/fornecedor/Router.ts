import { FastifyInstance } from "fastify";
import { ControllerFornecedor } from "./Controller.js";

export function Fornecedor_Route(app: FastifyInstance) {
  app.get("/fornecedor/:id", ControllerFornecedor.FindByIdController);
  app.get("/fornecedor", ControllerFornecedor.FindAllController);
  app.post("/fornecedor", ControllerFornecedor.CreateController);
  app.put("/fornecedor/:id", ControllerFornecedor.UpdateController);
  //   app.delete("/produto");
}
