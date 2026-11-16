import { FastifyInstance } from "fastify";
import { historicController } from "./controller.js";
import { middlewareValidatorOwner } from "../../../infra/http/middleware/Admin/index.js";

export function historic_route(app: FastifyInstance) {
  app.get(
    "/admin/audit-logs/actors",
    { preHandler: middlewareValidatorOwner },
    historicController.consultActor,
  );

  app.get(
    "/admin/audit-logs",
    { preHandler: middlewareValidatorOwner },
    historicController.consultAuditLogsController,
  );
}
