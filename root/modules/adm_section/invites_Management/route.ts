import { FastifyInstance } from "fastify";
import { middlewareValidatorOwner } from "../../../infra/http/middleware/Admin/index.js";
import { inviteManagement } from "./controller.js";

export function invites_route(app: FastifyInstance) {
  app.get(
    "/admin/invites",
    { preHandler: middlewareValidatorOwner },
    inviteManagement.consultInvitesController,
  );

  app.post(
    "/admin/invites",
    { preHandler: middlewareValidatorOwner },
    inviteManagement.createInviteController,
  );
}
