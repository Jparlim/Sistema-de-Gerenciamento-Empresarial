import { z } from "zod";
import { AppError } from "../../../infra/error/AppError.js";
import { serviceManagement } from "./service.js";
import { sessionAdminId } from "../shared.js";
const idSchema = z.coerce.number().int().positive();
const createSchema = z.object({ email: z.string().trim().email().max(254) });
const tokenSchema = z.object({ token: z.string().min(1).max(500) });
const acceptSchema = tokenSchema.extend({
    nome: z.string().trim().min(1).max(200),
    senha: z.string().min(6).max(200),
});
function actor(request) {
    try {
        return sessionAdminId(request);
    }
    catch {
        throw new AppError(401, "Sessão administrativa inválida.");
    }
}
export const inviteManagement = {
    async consultInvitesController(request, reply) {
        return reply.send(await serviceManagement.consultInvitesService(request.query));
    },
    async createInviteController(request, reply) {
        const { email } = createSchema.parse(request.body);
        return reply.send(await serviceManagement.createInviteService(actor(request), email));
    },
    async resendInviteController(request, reply) {
        const { id } = z.object({ id: idSchema }).parse(request.params);
        return reply.send(await serviceManagement.resendInviteService(actor(request), id));
    },
    async revokeInviteController(request, reply) {
        const { id } = z.object({ id: idSchema }).parse(request.params);
        return reply.send(await serviceManagement.revokeInviteService(actor(request), id));
    },
    async validateInviteController(request, reply) {
        const { token } = tokenSchema.parse(request.query);
        return reply.send(await serviceManagement.validateInvite(token));
    },
    async acceptInviteController(request, reply) {
        const { token, nome, senha } = acceptSchema.parse(request.body);
        return reply.send(await serviceManagement.acceptInvite(token, nome, senha));
    },
};
