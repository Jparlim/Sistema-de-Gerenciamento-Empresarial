import { FastifyInstance } from "fastify";
import { ControllerProduto } from "./Controller.js";

export function Produto_Route(app: FastifyInstance) {
  app.get("/produto/:id", ControllerProduto.FindByIdController);
  app.get("/produto", ControllerProduto.FindAllController);
  app.post("/produto", ControllerProduto.CreateController);
  app.put("/produto/:id", ControllerProduto.UpdateController);
  app.delete("/produto/:id", ControllerProduto.DeleteController);
}
