import { FastifyInstance } from "fastify";
import { ControllerFornecedor } from "./Controller.js";

export function Fornecedor_Route(app: FastifyInstance) {
  //   app.get("/produto");
  app.get("/fornecedor", ControllerFornecedor.FindAllController);
  app.post("/fornecedor", ControllerFornecedor.CreateController);
  //   app.put("/produto");
  //   app.delete("/produto");
}
