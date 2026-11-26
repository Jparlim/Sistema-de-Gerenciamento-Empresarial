import { ServicesAcount } from "./Services.js";
import { CreateAcountWithDataOnBody } from "./schema/SchemaAcount.js";
import { verifyCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";
import { sendVerificationCodeEmail } from "../../workflows/handleEmail/SendVerificationCode/index.js";
export const User_Pending_Controller = {
    async CreateUserPending(request, reply) {
        const data = CreateAcountWithDataOnBody.parse(request.body);
        const result = await ServicesAcount.CreateAcountPending(data);
        await sendVerificationCodeEmail(result.user.email, result.codigo);
        const tokenJWT = request.server.jwt.sign({
            id: result.user.id,
        }, {
            expiresIn: "15m",
        });
        return reply
            .status(200)
            .setCookie("tokenVerify", tokenJWT, verifyCookie)
            .send({
            success: true,
            email: result.user.email,
            expiresIn: 60 * 15,
            ...(process.env.NODE_ENV !== "production"
                ? { devToken: result.codigo }
                : {}),
        });
    },
    async ResendUserPending(request, reply) {
        const cookie = request.cookies.tokenVerify;
        if (!cookie)
            throw new AppError(401, "sessão de cadastro expirou, refaça o cadastro");
        const decode = request.server.jwt.verify(cookie);
        const result = await ServicesAcount.ResendToken(decode.id, request.server);
        request.log.info({ codigo: result.codigo }, "código de verificação reenviado");
        return reply
            .status(200)
            .setCookie("tokenVerify", result.token, verifyCookie)
            .send({
            success: true,
            email: result.user.email,
            expiresIn: 60 * 15,
            ...(process.env.NODE_ENV !== "production"
                ? { devToken: result.codigo }
                : {}),
        });
    },
    async DeleteUserPending(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesAcount.DeleteAcount(id);
    },
    async FindAllUserPending(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        const data = await ServicesAcount.FindAllAcount();
        return data;
    },
    async FindByIdUserPending(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return ServicesAcount.FindByIdAcount(id);
    },
};
