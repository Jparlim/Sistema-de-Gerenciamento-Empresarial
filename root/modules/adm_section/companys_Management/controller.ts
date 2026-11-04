import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceManagement } from "./services.js";

export const companyManagement = {
  async consultCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const token = request.cookies.refreshToken as string;

    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }

    const decode = request.server.jwt.decode(token) as {
      id: number;
      email: string;
      role: string;
    };

    return await ServiceManagement.consultCompanysService(decode.id);
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
