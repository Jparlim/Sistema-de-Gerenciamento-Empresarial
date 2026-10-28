import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceLogin } from "./Service.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";

export const ControllerLogin = {
  async logout(_request: FastifyRequest, reply: FastifyReply) {
    return reply
      .clearCookie("token", { path: "/" })
      .clearCookie("refreshToken", { path: "/" })
      .send({ success: true });
  },

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };

    await ServiceLogin.forgotPassword(email);
    return reply.send({ success: true });
  },

  async newPassword(request: FastifyRequest, reply: FastifyReply) {
    const { pass1, pass2 } = request.body as { pass1: string; pass2: string };
    const { token } = request.query as { token?: string };
    const { email } = request.query as { email?: string };

    if (!pass1 || !pass2) {
      throw new AppError(
        404,
        "é necessário uma nova senha para a redefinição!",
      );
    }

    if (!token) {
      throw new AppError(404, "token não fornecido ou não encontrado!");
    }

    const userData = await ServiceLogin.createNewPassword(
      pass1,
      pass2,
      token,
      email!,
    );

    const tokenJWT = request.server.jwt.sign(
      {
        IDcompany: userData.id,
        role: "user",
        estoqueId: userData.estoque?.id,
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        IDcompany: userData.id,
        role: "user",
        estoqueId: userData.estoque?.id,
      },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", tokenJWT, accessCookie)
      .setCookie("refreshToken", refreshToken, refreshCookie)
      .send({ success: true, token, refreshToken });
  },

  async validateUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as { email: string; senha: string };

    const data = await ServiceLogin.validateUser(email, senha);

    const estoque = await ServicesEstoque.FindByCompanyIdServices(data);

    if (!estoque)
      throw new AppError(500, "estoque não encontrado para a empresa!");

    const token = request.server.jwt.sign(
      {
        IDcompany: data,
        role: "user",
        estoqueId: estoque.id,
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        IDcompany: data,
        role: "user",
        estoqueId: estoque.id,
      },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, accessCookie)
      .setCookie("refreshToken", refreshToken, refreshCookie)
      .send({ success: true, token, refreshToken });
  },

  async validateAdmin(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as { email: string; senha: string };

    const userId = await ServiceLogin.validateAdmin(email, senha);

    const token = request.server.jwt.sign(
      {
        email: email,
        id: userId,
        role: "admin",
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        email: email,
        id: userId,
        role: "admin",
      },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, accessCookie)
      .setCookie("refreshToken", refreshToken, refreshCookie)
      .send({ success: true, token, refreshToken });
  },
};
