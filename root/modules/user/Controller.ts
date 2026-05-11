import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import {
  CreateAcount,
  UpdateAcount,
  CreateAcountPending,
} from "./schema/SchemaAcount.js";

export const User_Controller = {
  async CreateUser(request: FastifyRequest, reply: FastifyReply) {
    // const data = CreateAcount.parse(request.body);
    const { token } = request.body as { token: string };
    const cookie = request.cookies.tokenVerify as string;

    console.log(cookie);

    if (!cookie)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(cookie) as {
      id: number;
      token: string;
    };

    return ServicesAcount.CreateAcount(decode, token);
  },

  async UpdateUser(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateAcount.parse(request.body);
    const { id } = request.params as { id: number };

    return ServicesAcount.UpdateAcount(id, data);
  },

  async DeleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return ServicesAcount.DeleteAcount(id);
  },

  async FindAllUsers(request: FastifyRequest, reply: FastifyReply) {
    return ServicesAcount.FindAllAcount();
  },

  async FindByIdUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return ServicesAcount.FindByIdAcount(id);
  },
};
