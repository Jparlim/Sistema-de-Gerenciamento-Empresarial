import { z } from "zod";
import { AppError } from "../../../infra/error/AppError.js";
import { serviceManagement } from "./service.js";
import { sessionAdminId } from "../shared.js";
const idSchema = z.coerce.number().int().positive();
const statusSchema = z.object({ ativo: z.boolean() });
export const adminManagement = {
    async consultAllAdminsController(request, reply) {
        return reply.send(await serviceManagement.consultAllAdminsService(request.query));
    },
    async changeAdminStatusController(request, reply) {
        const { id } = z.object({ id: idSchema }).parse(request.params);
        const { ativo } = statusSchema.parse(request.body);
        let actorId;
        try {
            actorId = sessionAdminId(request);
        }
        catch {
            throw new AppError(401, "Sessão administrativa inválida.");
        }
        await serviceManagement.changeAdminStatus(id, ativo, actorId);
        return reply.send({
            success: true,
            message: ativo
                ? "Administrador reativado com sucesso."
                : "Administrador desativado com sucesso.",
        });
    },
};
