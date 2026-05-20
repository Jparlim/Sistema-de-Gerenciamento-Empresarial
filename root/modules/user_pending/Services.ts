import { CreateAcountPendingOfBodyType } from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { Prisma } from "../../infra/database/client.js";

const repository = new RepositoryCount();

export const ServicesAcount = {
  async CreateAcountPending(
    data: CreateAcountPendingOfBodyType,
    jwt: FastifyInstance,
  ) {
    const verify = await Prisma.company.findFirst({
      where: {
        OR: [
          { nomeEmpresa: data.nomeEmpresa },
          { CNPJ: data.CNPJ },
          { telefone: data.telefone },
        ],
      },
    });

    const verify_pending = await Prisma.company_Pending.findFirst({
      where: {
        OR: [
          { nomeEmpresa: data.nomeEmpresa },
          { CNPJ: data.CNPJ },
          { telefone: data.telefone },
        ],
      },
    });

    if (verify || verify_pending) {
      throw new Error("Empresa já cadastrada!");
    }

    const tokenSend = crypto.randomInt(100000, 1000000).toString();
    const hashSenha = await bcrypt.hash(data.senha, 10);

    const newData = {
      ...data,
      senha: hashSenha,
      token: tokenSend,
      token_expires: new Date(Date.now() + 15 * 60 * 1000),
    };

    const IdPending = await repository.createPending(newData);

    const tokenJWT = jwt.jwt.sign(
      {
        id: IdPending.id,
        token: tokenSend,
      },
      {
        expiresIn: "5m",
      },
    );

    return { token: tokenJWT, user: IdPending };
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
