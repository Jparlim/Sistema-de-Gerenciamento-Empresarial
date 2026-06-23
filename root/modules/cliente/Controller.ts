import { FastifyReply, FastifyRequest } from "fastify";
import { SchemaDataClient } from "./schema/SchemaCliente.js";
import { ServicesClient } from "./Services.js";

export const ControllerClient = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaDataClient.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesClient.CreateService(data, decode.IDcompany);
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaDataClient.parse(request.body);
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!id)
      return reply
        .status(400)
        .send({ message: "ID do cliente não fornecido!" });

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    return await ServicesClient.UpdateServices(id, data);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!id)
      return reply
        .status(400)
        .send({ message: "ID do cliente não fornecido!" });

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesClient.DeleteServices(id);
  },
  async FindAllController() {
    return await ServicesClient.FindAllServices();
  },
  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    if (!id)
      return reply
        .status(400)
        .send({ message: "ID do cliente não fornecido!" });

    return await ServicesClient.FindByIdServices(id);
  },
};
