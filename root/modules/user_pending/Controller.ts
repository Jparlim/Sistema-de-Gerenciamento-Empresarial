import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { CreateAcountPending } from "./schema/SchemaAcount.js";

export const User_Pending_Controller = {
  async CreateUserPending(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateAcountPending.parse(request.body);

    const token = await ServicesAcount.CreateAcountPending(data, request.server);

    return reply
      .status(200)
      .setCookie("tokenVerify", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 5,
      })
      .send({ success: true });
  },

  async DeleteUserPending(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return ServicesAcount.DeleteAcount(id);
  },

  async FindAllUserPending(request: FastifyRequest, reply: FastifyReply) {
    return ServicesAcount.FindAllAcount();
  },

  async FindByIdUserPending(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return ServicesAcount.FindByIdAcount(id);
  },
};
