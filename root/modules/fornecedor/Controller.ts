import { FastifyRequest, FastifyReply } from "fastify";
import { CreateController, UpdateController } from "./schema/SchemaProduto.js";
import { ServicesFornecedor } from "./Services.js";

export const ControllerFornecedor = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateController.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não informado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
      estoqueId: number;
    };

    if (decode.role !== "admin")
      return reply.status(401).send({ message: "acesso negado!" });

    return await ServicesFornecedor.CreateServices(data);
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateController.parse(request.body);
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não enviado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
      estoqueId: number;
    };

    if (decode.role !== "admin")
      return reply.status(401).send({ message: "acesso negado!" });

    return await ServicesFornecedor.UpdateServices(data, id);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {},

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    return await ServicesFornecedor.FindAllServices();
  },

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return await ServicesFornecedor.FindByIdServices(id);
  },
};
