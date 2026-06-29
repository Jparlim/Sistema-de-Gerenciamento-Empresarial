import { FastifyReply, FastifyRequest } from "fastify";
import { SchemaCreateVisits } from "./schema/SchemaVisits.js";
import { ServicesVisits } from "./Services.js";

export const Controller = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaCreateVisits.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesVisits.CreateServices(data);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    if (!id) return reply.status(401).send({ message: "id não fornecido!" });

    return ServicesVisits.DeleteServices(id);
  },

  async FindAllController() {
    return await ServicesVisits.FindAllServices();
  },

  async UpdateController() {},

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    if (!id) return reply.status(401).send("id não providenciado!");

    return await ServicesVisits.FindByIdServices(id);
  },
};
