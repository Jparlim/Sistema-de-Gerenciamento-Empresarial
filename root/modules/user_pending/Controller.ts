import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { CreateAcountWithDataOnBody } from "./schema/SchemaAcount.js";

export const User_Pending_Controller = {
  async CreateUserPending(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateAcountWithDataOnBody.parse(request.body);

    const token = await ServicesAcount.CreateAcountPending(
      data,
      request.server,
    );

    reply.status(200).setCookie("tokenVerify", token.token, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 60 * 15,
    });

    return console.log("token enviado para o navegador", token.token);
  },

  async DeleteUserPending(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return await ServicesAcount.DeleteAcount(id);
  },

  async FindAllUserPending(request: FastifyRequest, reply: FastifyReply) {
    const data = await ServicesAcount.FindAllAcount();
    return data;
  },

  async FindByIdUserPending(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return ServicesAcount.FindByIdAcount(id);
  },
};
