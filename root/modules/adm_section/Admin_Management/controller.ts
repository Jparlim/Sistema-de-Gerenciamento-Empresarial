import { FastifyReply, FastifyRequest } from "fastify";
import { serviceManagement } from "./service.js";

export const adminManagement = {
  async consultAdminMeController(request: FastifyRequest, reply: FastifyReply) {
    const { search } = request.query as { search?: string };
    try {
      const admin = await serviceManagement.consultAdminMeService(search);
      return reply.send({
        items: admin,
      });
    } catch (error) {
      return reply
        .status(404)
        .send({ sucess: false, message: (error as Error).message });
    }
  },

  async consultAllAdminsController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const admins = await serviceManagement.consultAllAdminsService();
      return reply.send({
        items: admins,
        total: admins.length,
        page: 1,
        pageSize: 10,
        activeOwnerCount: admins.filter((admin) => admin.role === "owner")
          .length,
      });
    } catch (error) {
      return reply
        .status(500)
        .send({ sucess: false, message: (error as Error).message });
    }
  },
};
