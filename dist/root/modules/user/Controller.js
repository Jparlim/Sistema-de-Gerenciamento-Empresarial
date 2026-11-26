import { ServicesAcount } from "./Services.js";
import { UpdateAcount } from "./schema/SchemaAcount.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { VerifyTokenBody } from "./schema/SchemaAcount.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";
export const User_Controller = {
    async CreateUser(request, reply) {
        const { token } = VerifyTokenBody.parse(request.body);
        const cookie = request.cookies.tokenVerify;
        if (!cookie)
            throw new AppError(401, "token não encontrado!");
        const decode = request.server.jwt.verify(cookie);
        const id = await ServicesAcount.CreateAcount(decode, token);
        const estoqueId = await ServicesEstoque.CreateServices(id);
        const tokenJwt = request.server.jwt.sign({ IDcompany: id, role: "user", estoqueId: estoqueId.id }, { expiresIn: "7d" });
        const refreshTokenJwt = request.server.jwt.sign({ IDcompany: id, role: "user", estoqueId: estoqueId.id }, { expiresIn: "30min" });
        return reply
            .setCookie("token", tokenJwt, accessCookie)
            .setCookie("refreshToken", refreshTokenJwt, refreshCookie)
            .clearCookie("tokenVerify", { path: "/" })
            .send({ success: true, token: tokenJwt, refreshToken: refreshTokenJwt });
    },
    async UpdateUser(request, reply) {
        const data = UpdateAcount.parse(request.body);
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesAcount.UpdateAcount(id, data);
    },
    async DeleteUser(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesAcount.DeleteAcount(id);
    },
    async FindAllUsers(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesAcount.FindAllAcount();
    },
    async FindByIdUser(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesAcount.FindByIdAcount(id);
    },
};
