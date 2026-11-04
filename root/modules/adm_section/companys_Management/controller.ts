import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceManagement } from "./services.js";

export const companyManagement = {
  async consultAllCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultAllCompanysService();
  },
  async consultActivateCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultActivateCompanysService();
  },
  async consultDesactivateCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultDesactivateCompanysService();
  },
  async consultHowManyCompanys_pendingController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultHowManyCompanys_pendingService();
  },
  async consultCompanysActivatedController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultCompanysActivatedService();
  },
  async consultCompanysInactivatedController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultCompanysInactivatedService();
  },

  async consultAdminMeController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    const decode = request.server.jwt.decode(token) as {
      id: number;
      email: string;
      role: string;
    };

    const user = await ServiceManagement.consultAdminMeService(decode.id);

    return reply.send({
      admin: {
        id: user?.id,
        nome: user?.nome,
        email: user?.email,
        role: user?.role,
        ativo: user?.ativo,
        createdAt: user?.createdAt,
        lastLoginAt: null,
      },
    });
  },
};
