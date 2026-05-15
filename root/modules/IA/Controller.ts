import { FastifyReply, FastifyRequest } from "fastify";
import { SchemaCreateIA } from "./schema/schemaIA.js";
import { ServicesIA } from "./Services.js";

export const ControllerIA = {
  async CreateIA(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaCreateIA.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesIA.CreateConfig(data, decode.IDcompany);
  },
};
