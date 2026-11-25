import { FastifyReply, FastifyRequest } from "fastify";
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

function actor(request: FastifyRequest) {
  try {
    return sessionAdminId(request);
  } catch {
    throw new AppError(401, "Sessão administrativa inválida.");
  }
}

export const inviteManagement = {
  async consultInvitesController(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(
      await serviceManagement.consultInvitesService(request.query),
    );
  },
  async createInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { email } = createSchema.parse(request.body);
    return reply.send(
      await serviceManagement.createInviteService(actor(request), email),
    );
  },
  async resendInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: idSchema }).parse(request.params);
    return reply.send(
      await serviceManagement.resendInviteService(actor(request), id),
    );
  },
  async revokeInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z.object({ id: idSchema }).parse(request.params);
    return reply.send(
      await serviceManagement.revokeInviteService(actor(request), id),
    );
  },
  async validateInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { token } = tokenSchema.parse(request.query);
    return reply.send(await serviceManagement.validateInvite(token));
  },
  async acceptInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { token, nome, senha } = acceptSchema.parse(request.body);
    return reply.send(await serviceManagement.acceptInvite(token, nome, senha));
  },
};
