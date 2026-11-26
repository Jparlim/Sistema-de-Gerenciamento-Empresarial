import { AppError } from "../../../infra/error/AppError.js";
import { ServiceManagement } from "./services.js";
import { sessionAdminId } from "../shared.js";
import { z } from "zod";
const idSchema = z.coerce.number().int().positive();
const statusSchema = z.object({
    status: z.boolean(),
    statusReason: z.string().trim().max(2000).optional(),
});
export const companyManagement = {
    async consultCompanysController(_request, reply) {
        return reply.send(await ServiceManagement.consultCompanysService());
    },
    async consultCompanysFilteredController(request, reply) {
        return reply.send(await ServiceManagement.consultCompanysFilteredService(request.query));
    },
    async consultAdminMeController(request, reply) {
        let id;
        try {
            id = sessionAdminId(request);
        }
        catch {
            throw new AppError(401, "Sessão administrativa inválida.");
        }
        const admin = await ServiceManagement.consultAdminMeService(id);
        if (!admin || !admin.ativo)
            throw new AppError(401, "Sessão administrativa inválida.");
        return reply.send({ admin });
    },
    async consultCompanyByIdController(request, reply) {
        const { id } = z.object({ id: idSchema }).parse(request.params);
        return reply.send(await ServiceManagement.consultCompanyByIdService(id));
    },
    async desativarCompanyByIdController(request, reply) {
        const { id } = z.object({ id: idSchema }).parse(request.params);
        const body = statusSchema.parse(request.body);
        let actorId;
        try {
            actorId = sessionAdminId(request);
        }
        catch {
            throw new AppError(401, "Sessão administrativa inválida.");
        }
        await ServiceManagement.setCompanyStatus(id, body.status, body.statusReason, actorId);
        return reply.send({
            success: true,
            message: body.status
                ? "Empresa reativada com sucesso."
                : "Empresa desativada com sucesso.",
        });
    },
};
