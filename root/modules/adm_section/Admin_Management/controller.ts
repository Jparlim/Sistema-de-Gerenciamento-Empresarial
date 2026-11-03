import { FastifyReply, FastifyRequest } from "fastify";

export const adminManagement = {
  async activateCompany(req: FastifyRequest, reply: FastifyReply) {},
  async desactivateCompany(req: FastifyRequest, reply: FastifyReply) {},

  async activateAdmin(req: FastifyRequest, reply: FastifyReply) {},
  async desactivateAdmin(req: FastifyRequest, reply: FastifyReply) {},
  async consultHistoricAdmin(req: FastifyRequest, reply: FastifyReply) {},
  async inviteANewAdmin(req: FastifyRequest, reply: FastifyReply) {},
};
