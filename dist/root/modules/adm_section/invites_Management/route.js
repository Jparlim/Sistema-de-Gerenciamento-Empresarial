import { middlewareValidatorAdm, middlewareValidatorOwner } from "../../../infra/http/middleware/Admin/index.js";
import { inviteManagement } from "./controller.js";
export function invites_route(app) {
    app.get("/admin/invites", { preHandler: middlewareValidatorAdm }, inviteManagement.consultInvitesController);
    app.post("/admin/invites", { preHandler: middlewareValidatorOwner }, inviteManagement.createInviteController);
    app.post("/admin/invites/:id/resend", { preHandler: middlewareValidatorOwner }, inviteManagement.resendInviteController);
    app.post("/admin/invites/:id/revoke", { preHandler: middlewareValidatorOwner }, inviteManagement.revokeInviteController);
    app.get("/admin/invites/validate", { logLevel: "silent" }, inviteManagement.validateInviteController);
    app.post("/admin/invites/accept", inviteManagement.acceptInviteController);
}
