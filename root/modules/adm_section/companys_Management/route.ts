import { FastifyInstance } from "fastify";
import { companyManagement } from "./controller.js";
import { middlewareValidatorAdm } from "../../../infra/http/middleware/Admin/index.js";

export function manageCompanys_route(app: FastifyInstance) {
  app.get(
    "/admin/consultAllCompanys",
    { preHandler: middlewareValidatorAdm },
    companyManagement.consultAllCompanysController,
  );
  app.get(
    "/admin/consultActivateCompanys",
    {
      preHandler: middlewareValidatorAdm,
    },
    companyManagement.consultActivateCompanysController,
  );
  app.get(
    "/admin/consultDesactivateCompanys",
    {
      preHandler: middlewareValidatorAdm,
    },
    companyManagement.consultDesactivateCompanysController,
  );
  app.get(
    "/admin/consultHowManyCompanys_pending",
    {
      preHandler: middlewareValidatorAdm,
    },
    companyManagement.consultHowManyCompanys_pendingController,
  );
  app.get(
    "/admin/consultCompanysActivated",
    {
      preHandler: middlewareValidatorAdm,
    },
    companyManagement.consultCompanysActivatedController,
  );
  app.get(
    "/admin/consultCompanysInactivated",
    {
      preHandler: middlewareValidatorAdm,
    },
    companyManagement.consultCompanysInactivatedController,
  );

  app.get(
    "/admin/me",
    { preHandler: middlewareValidatorAdm },
    companyManagement.consultAdminMeController,
  );
}
