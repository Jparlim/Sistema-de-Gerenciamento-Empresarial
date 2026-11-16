import { FastifyRequest, FastifyReply } from "fastify";
import { serviceManagement } from "./service.js";
import { stat } from "fs";

enum statusOption {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

export const inviteManagement = {
  async consultInvitesController(request: FastifyRequest, reply: FastifyReply) {
    const { search, status, page, pageSize } = request.query as {
      search?: string;
      status?: statusOption;
      page?: number;
      pageSize?: number;
    };

    const invites = await serviceManagement.consultInvitesService(
      search,
      status,
    );

    return reply.status(200).send(invites);
  },
};
