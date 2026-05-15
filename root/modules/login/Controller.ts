import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceLogin } from "./Service.js";

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
      .setCookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
      })
      .setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      .send({ success: true, token, refreshToken });
  },
};
