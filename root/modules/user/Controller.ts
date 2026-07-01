import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import {
  CreateAcount,
  UpdateAcount,
  CreateAcountPending,
} from "./schema/SchemaAcount.js";
import { ServicesEstoque } from "../estoque/Services.js";

export const User_Controller = {
  async CreateUser(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.body as { token: string };
    const cookie = request.cookies.tokenVerify as string;

    if (!cookie)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(cookie) as {
      id: number;
      token: string;
    };

    const id = await ServicesAcount.CreateAcount(decode, token);

    await ServicesEstoque.CreateServices(id);

    const tokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "admin" },
      { expiresIn: "30m" },
    );

    const refreshTokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "admin" },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", tokenJwt, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15,
      })
      .setCookie("refreshToken", refreshTokenJwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .send({ success: true, token: tokenJwt, refreshToken: refreshTokenJwt });
  },

  async UpdateUser(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateAcount.parse(request.body);
    const { id } = request.params as { id: number };

    return await ServicesAcount.UpdateAcount(id, data);
  },

  async DeleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return await ServicesAcount.DeleteAcount(id);
  },

  async FindAllUsers(request: FastifyRequest, reply: FastifyReply) {
    return await ServicesAcount.FindAllAcount();
  },

  async FindByIdUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    return await ServicesAcount.FindByIdAcount(id);
  },
};
