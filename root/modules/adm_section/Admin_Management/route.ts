import { FastifyInstance } from "fastify";
import { middlewareValidatorOwner } from "../../../infra/http/middleware/Admin/index.js";
import { adminManagement } from "./controller.js";

export function manageAdmin_route(app: FastifyInstance) {
  app.get(
    "/admin/administrators",
    { preHandler: middlewareValidatorOwner },
    adminManagement.consultAllAdminsController,
  );
}
