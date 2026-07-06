import { FastifyReply, FastifyRequest } from "fastify";
import { CreateToController } from "./schema/SchemaProduto.js";
import { ServicesProduto } from "./Services.js";

export const ControllerProduto = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateToController.parse(request.body);
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

    return await ServicesProduto.CreateServices({
      ...data,
      estoqueId: decode.estoqueId,
    });
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {},

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {},

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    return await ServicesProduto.FindAllServices();
  },

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {},
};
