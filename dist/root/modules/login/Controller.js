import { ServiceLogin } from "./Service.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";
export const ControllerLogin = {
    async logout(_request, reply) {
        return reply
            .clearCookie("token", { path: "/" })
            .clearCookie("refreshToken", { path: "/" })
            .send({ success: true });
    },
    async forgotPassword(request, reply) {
        const { email } = request.body;
        await ServiceLogin.forgotPassword(email);
        return reply.send({ success: true });
    },
    async newPassword(request, reply) {
        const { pass1, pass2 } = request.body;
        const { token } = request.query;
        const { email } = request.query;
        if (!pass1 || !pass2) {
            throw new AppError(404, "é necessário uma nova senha para a redefinição!");
        }
        if (!token) {
            throw new AppError(404, "token não fornecido ou não encontrado!");
        }
        const userData = await ServiceLogin.createNewPassword(pass1, pass2, token, email);
        const tokenJWT = request.server.jwt.sign({
            IDcompany: userData.id,
            role: "user",
            estoqueId: userData.estoque?.id,
        }, { expiresIn: "30m" });
        const refreshToken = request.server.jwt.sign({
            IDcompany: userData.id,
            role: "user",
            estoqueId: userData.estoque?.id,
        }, { expiresIn: "7d" });
        return reply
            .setCookie("token", tokenJWT, accessCookie)
            .setCookie("refreshToken", refreshToken, refreshCookie)
            .send({ success: true, token, refreshToken });
    },
    async validateUser(request, reply) {
        const { email, senha } = request.body;
        const data = await ServiceLogin.validateUser(email, senha);
        const estoque = await ServicesEstoque.FindByCompanyIdServices(data);
        if (!estoque)
            throw new AppError(500, "estoque não encontrado para a empresa!");
        const token = request.server.jwt.sign({
            IDcompany: data,
            role: "user",
            estoqueId: estoque.id,
        }, { expiresIn: "30m" });
        const refreshToken = request.server.jwt.sign({
            IDcompany: data,
            role: "user",
            estoqueId: estoque.id,
        }, { expiresIn: "7d" });
        return reply
            .setCookie("token", token, accessCookie)
            .setCookie("refreshToken", refreshToken, refreshCookie)
            .send({ success: true, token, refreshToken });
    },
    async validateAdmin(request, reply) {
        const { email, senha } = request.body;
        const userId = await ServiceLogin.validateAdmin(email, senha);
        const token = request.server.jwt.sign({
            id: userId.id,
            email: email,
            role: userId.role,
        }, { expiresIn: "30m" });
        const refreshToken = request.server.jwt.sign({
            email: email,
            id: userId.id,
            role: userId.role,
        }, { expiresIn: "7d" });
        return reply
            .setCookie("token", token, accessCookie)
            .setCookie("refreshToken", refreshToken, refreshCookie)
            .send({ success: true, token, refreshToken });
    },
};
