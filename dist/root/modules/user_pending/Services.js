import { RepositoryCount } from "./Repository.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Prisma } from "../../infra/database/client.js";
import { AppError } from "../../infra/error/AppError.js";
const repository = new RepositoryCount();
export const ServicesAcount = {
    async CreateAcountPending(data) {
        const userPendente = await repository.findFirst(data);
        const userCadastrado = await repository.findFirstCompanyExists(data);
        if (userCadastrado) {
            throw new AppError(409, "Empresa já cadastrada!");
        }
        if (userPendente) {
            throw new AppError(409, "Empresa pendente para finalização de cadastro!");
        }
        try {
            const formatedCNPJ = data.CNPJ.replace(/\D/g, "");
            await fetch(`https://receitaws.com.br/v1/cnpj/${formatedCNPJ}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            });
        }
        catch (error) {
            throw new AppError(401, "não foi possível validar o CNPJ, tente novamente mais tarde!");
        }
        const tokenSended = crypto.randomInt(100000, 1000000).toString();
        const hashSenha = await bcrypt.hash(data.senha, 10);
        const newData = {
            ...data,
            telefone: data.telefone.replace(/\D/g, ""),
            senha: hashSenha,
            token: tokenSended,
            token_expires: new Date(Date.now() + 15 * 60 * 1000),
        };
        const IdUserPending = await repository.createPending(newData);
        return { user: IdUserPending, codigo: tokenSended };
    },
    async ResendToken(pendingId, token) {
        const pending = await repository.findById(pendingId);
        if (!pending)
            throw new AppError(404, "cadastro pendente não encontrado!");
        const tokenSend = crypto.randomInt(100000, 1000000).toString();
        await Prisma.company_Pending.update({
            where: { id: pendingId },
            data: {
                token: tokenSend,
                token_expires: new Date(Date.now() + 15 * 60 * 1000),
            },
        });
        const tokenJWT = token.jwt.sign({ id: pendingId }, { expiresIn: "15m" });
        return { token: tokenJWT, user: pending, codigo: tokenSend };
    },
    async DeleteAcount(id) {
        return await repository.delete(id);
    },
    async FindAllAcount() {
        return await repository.findAll();
    },
    async FindByIdAcount(id) {
        return await repository.findById(id);
    },
};
