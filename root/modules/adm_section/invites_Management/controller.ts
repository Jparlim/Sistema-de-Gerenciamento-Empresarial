import { FastifyRequest, FastifyReply } from "fastify";
import { serviceManagement } from "./service.js";
import { AppError } from "../../../infra/error/AppError.js";
import { sendInviteToNewAdmin } from "../../../workflows/handleEmail/sendInviteNewAdmin/index.js";
import { success } from "zod";

enum statusOption {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

type CompanyToken = {
  id: number;
  email: string;
  role: string;
};

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

  async createInviteController(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };
    const token = request.cookies.refreshToken;

    if (!token) throw new AppError(401, "token não encontrado!");

    const decoded = request.server.jwt.verify(token) as Partial<CompanyToken>;

    const url = await serviceManagement.createInviteService(decoded.id!, email);

    await sendInviteToNewAdmin(email, url.toString());

    return reply.status(200).send({ success: true });
  },
};
