import { FastifyInstance } from "fastify";
import { ControllerProduto } from "./Controller.js";

export function Produto_Route(app: FastifyInstance) {
  //   app.get("/produto");
  app.get("/produto", ControllerProduto.FindAllController);
  app.post("/produto", ControllerProduto.CreateController);
  //   app.put("/produto");
  //   app.delete("/produto");
}
