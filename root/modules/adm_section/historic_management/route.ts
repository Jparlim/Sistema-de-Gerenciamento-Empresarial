import { FastifyInstance } from "fastify";
import { historicController } from "./controller.js";
import { middlewareValidatorAdm } from "../../../infra/http/middleware/Admin/index.js";

export function historic_route(app: FastifyInstance) {
  app.get(
    "/admin/audit-logs/actors",
    { preHandler: middlewareValidatorAdm },
    historicController.consultActor,
  );

  app.get(
    "/admin/audit-logs",
    { preHandler: middlewareValidatorAdm },
    historicController.consultAuditLogsController,
  );
}
