import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceLogin } from "./Service.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";

export const ControllerLogin = {
  async validateUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as { email: string; senha: string };

    const data = await ServiceLogin.validateUser(email, senha);

    const token = request.server.jwt.sign(
      {
        IDcompany: data,
        role: "admin",
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        IDcompany: data,
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
