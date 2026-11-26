import { middlewareValidatorAdm, middlewareValidatorOwner } from "../../../infra/http/middleware/Admin/index.js";
import { adminManagement } from "./controller.js";
export function manageAdmin_route(app) {
    app.get("/admin/administrators", { preHandler: middlewareValidatorAdm }, adminManagement.consultAllAdminsController);
    app.patch("/admin/administrators/:id/status", { preHandler: middlewareValidatorOwner }, adminManagement.changeAdminStatusController);
}
