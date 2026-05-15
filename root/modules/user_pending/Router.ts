import type { FastifyInstance } from "fastify";
import { User_Pending_Controller } from "./Controller.js";

export async function User_pending_Route(app: FastifyInstance) {
  app.get("/user_pending", User_Pending_Controller.FindAllUserPending);
  app.get("/user_pending/:id", User_Pending_Controller.FindByIdUserPending);
  app.post("/user_pending", User_Pending_Controller.CreateUserPending);
  app.delete("/user_pending/:id", User_Pending_Controller.DeleteUserPending);
}
