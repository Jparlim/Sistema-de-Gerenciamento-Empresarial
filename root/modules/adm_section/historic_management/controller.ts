import { FastifyReply, FastifyRequest } from "fastify";
import { historicService } from "./service.js";
import { auditLogQuerySchema } from "./query.js";

export const historicController = {
  async consultAuditLogsController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const query = auditLogQuerySchema.parse(request.query);
    return reply.send(await historicService.consultHistoric(query));
  },

  async consultActor(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send(await historicService.consultActors());
  },
};
