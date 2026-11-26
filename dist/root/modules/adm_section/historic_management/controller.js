import { historicService } from "./service.js";
import { auditLogQuerySchema } from "./query.js";
export const historicController = {
    async consultAuditLogsController(request, reply) {
        const query = auditLogQuerySchema.parse(request.query);
        return reply.send(await historicService.consultHistoric(query));
    },
    async consultActor(_request, reply) {
        return reply.send(await historicService.consultActors());
    },
};
