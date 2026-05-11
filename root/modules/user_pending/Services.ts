import { CreateAcountPendingType } from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import { prisma } from "../../../src/Prisma_Client/index.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { request } from "https";

const repository = new RepositoryCount();

export const ServicesAcount = {
  async CreateAcountPending(
    data: CreateAcountPendingType,
    jwt: FastifyInstance,
  ) {
    const verify = await prisma.company.findFirst({
      where: {
        or: [
          { nomeEmpresa: data.nome },
          { CNPJ: data.CNPJ },
          { numero: data.numero },
        ],
      },
    });

    if (verify) {
      throw new Error("Empresa já cadastrada!");
    }

    const tokenSend = crypto.randomInt(100000, 1000000).toString();
    const hashSenha = await bcrypt.hash(data.senha, 10);

    const newData = { ...data, senha: hashSenha, token: tokenSend };

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

    console.log(tokenSend);

    return tokenJWT;
  },

  async DeleteAcount(id: number) {
    return repository.delete(id);
  },

  async FindAllAcount() {
    return repository.findAll();
  },

  async FindByIdAcount(id: number) {
    return repository.findById(id);
  },
};
