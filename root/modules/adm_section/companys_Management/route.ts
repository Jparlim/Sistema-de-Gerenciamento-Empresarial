import { FastifyInstance } from "fastify";
import { companyManagement } from "./controller.js";
import { middlewareValidatorAdm } from "../../../infra/http/middleware/Admin/index.js";

export function manageCompanys_route(app: FastifyInstance) {
  app.get(
    "/admin/dashboard",
    { preHandler: middlewareValidatorAdm },
    companyManagement.consultCompanysController,
  );

  app.get(
    "/admin/me",
    { preHandler: middlewareValidatorAdm },
    companyManagement.consultAdminMeController,
  );
}
