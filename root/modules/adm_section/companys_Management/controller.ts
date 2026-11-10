import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceManagement } from "./services.js";
import { AppError } from "../../../infra/error/AppError.js";

export const companyManagement = {
  async consultCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultCompanysService();
  },

  async consultCompanysFilteredController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { search, status, from, to } = request.query as {
      search?: string;
      status?: "ACTIVE" | "INACTIVE";
      from?: Date;
      to?: Date;
    };

    const company = await ServiceManagement.consultCompanysFilteredService(
      search,
      status,
      from,
      to,
    );

    return reply.send(company);
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
        lastLoginAt: user?.lastLoginAt,
      },
    });
  },

  async consultCompanyByIdController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } = request.params as { id?: number };

    try {
      if (!id) {
        throw new AppError(404, "Informações da empresa não encontrado");
      }

      const company = await ServiceManagement.consultCompanyByIdService(id);

      return reply.send(company);
    } catch (error) {
      return reply
        .status(404)
        .send({ success: false, message: (error as Error).message });
    }
  },

  async desativarCompanyByIdController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { id } = request.params as { id: number };
    try {
      if (!id) {
        throw new AppError(
          404,
          "Dados da empresa não fornecido para a desativação!",
        );
      }

      await ServiceManagement.desativarCompanyByIdService(id);
      return reply
        .status(200)
        .send({ success: true, message: "empresa desativada com sucesso!" });
    } catch (error) {
      return reply
        .status(404)
        .send({ success: false, message: (error as Error).message });
    }
  },
};
