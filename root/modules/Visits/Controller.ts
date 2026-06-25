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

    return ServicesVisits.CreateServices(data);
  },

  async DeleteController() {},

  async FindAllController() {},

  async UpdateController() {},

  async FindByIdController() {},
};
