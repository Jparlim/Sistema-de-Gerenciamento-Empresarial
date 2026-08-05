import { CreateAcountPendingOfBodyType } from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { Prisma } from "../../infra/database/client.js";
import { AppError } from "../../infra/error/AppError.js";

const repository = new RepositoryCount();

export const ServicesAcount = {
  async CreateAcountPending(
    data: CreateAcountPendingOfBodyType,
    token: FastifyInstance,
  ) {
    const verify = await repository.findFirst(data);

    const verify_pending = await repository.findFirstCompanyExists(data);

    if (verify || verify_pending) {
      throw new AppError(409, "Empresa já cadastrada!");
    }

    const tokenSend = crypto.randomInt(100000, 1000000).toString();
    const hashSenha = await bcrypt.hash(data.senha, 10);

    const newData = {
      ...data,
      telefone: data.telefone.replace(/\D/g, ""),
      senha: hashSenha,
      token: tokenSend,
      token_expires: new Date(Date.now() + 15 * 60 * 1000),
    };

    const IdPending = await repository.createPending(newData);

    const tokenJWT = token.jwt.sign(
      {
        id: IdPending.id,
      },
      {
        expiresIn: "15m",
      },
    );

    return { token: tokenJWT, user: IdPending, codigo: tokenSend };
  },

  async ResendToken(pendingId: number, token: FastifyInstance) {
    const pending = await repository.findById(pendingId);

    if (!pending) throw new AppError(404, "cadastro pendente não encontrado!");

    const tokenSend = crypto.randomInt(100000, 1000000).toString();

    await Prisma.company_Pending.update({
      where: { id: pendingId },
      data: {
        token: tokenSend,
        token_expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const tokenJWT = token.jwt.sign(
      { id: pendingId },
      { expiresIn: "15m" },
    );

    return { token: tokenJWT, user: pending, codigo: tokenSend };
  },

  async DeleteAcount(id: number) {
    return await repository.delete(id);
  },

  async FindAllAcount() {
    return await repository.findAll();
  },

  async FindByIdAcount(id: number) {
    return await repository.findById(id);
  },
};
