import { FastifyRequest, FastifyReply } from "fastify";
import { historicService } from "./service.js";

interface actorIdODT {
  id: number;
  nome: string;
  email: string;
}

export const historicController = {
  async consultAuditLogsController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const { search, actorId, action, from, to } = request.query as {
      search: string;
      actorId: actorIdODT;
      action: string;
      from: string;
      to: string;
    };

    return reply.send(await historicService.consultHistoric());
  },

  async consultActor(request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await historicService.consultActors());
  },
};
