import { FastifyReply, FastifyRequest } from "fastify";
import { ServicesEstoque } from "./Services.js";

export const ControllerEstoque = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesEstoque.CreateServices(decode.IDcompany);
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {},

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    if (!id) return reply.status(401).send({ message: "id não fornecido!" });

    return await ServicesEstoque.DeleteServices(id);
  },

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    return await ServicesEstoque.FindAllServices();
  },

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    if (!id) return reply.status(401).send({ message: "id não fornecido!" });

    return await ServicesEstoque.FindByIdServices(id);
  },
};
