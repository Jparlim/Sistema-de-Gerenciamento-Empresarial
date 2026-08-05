import { FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { UpdateAcount } from "./schema/SchemaAcount.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { VerifyTokenBody } from "./schema/SchemaAcount.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";

export const User_Controller = {
  async CreateUser(request: FastifyRequest, reply: FastifyReply) {
    const { token } = VerifyTokenBody.parse(request.body);
    const cookie = request.cookies.tokenVerify as string;

    if (!cookie) throw new AppError(401, "token não encontrado!");

    const decode = request.server.jwt.verify(cookie) as {
      id: number;
    };

    const id = await ServicesAcount.CreateAcount(decode, token);

    const estoqueId = await ServicesEstoque.CreateServices(id);

    const tokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "admin", estoqueId: estoqueId.id },
      { expiresIn: "30m" },
    );

    const refreshTokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "admin", estoqueId: estoqueId.id },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", tokenJwt, accessCookie)
      .setCookie("refreshToken", refreshTokenJwt, refreshCookie)
      .clearCookie("tokenVerify", { path: "/" })
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
