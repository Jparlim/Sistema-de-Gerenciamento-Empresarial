import { FastifyInstance } from "fastify";

import { ControllerAdm } from "./Controller.js";

export async function Router_Adm(App: FastifyInstance) {
  App.get("/", ControllerAdm.findAllController);
  App.post("/", ControllerAdm.CreateController);
  App.delete("/:id", ControllerAdm.deleteController);
  App.put("/:id", ControllerAdm.updateController);
}
