import {
  CreateAcount,
  CreateAcountPendingType,
  CreateAcountType,
  UpdateAcountType,
} from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import { Prisma } from "../../infra/database/client.js";
import crypto from "crypto";

const repository = new RepositoryCount();

export const ServicesAcount = {
  async CreateAcount(data: { id: number; token: string }, token: string) {
    const verify = await repository.findByIdPending(data.id);

    if (!verify)
      throw new Error("Ocorreu um erro! empresa não foi encontrada!");

    if (token !== verify.token) {
      const newToken = crypto.randomInt(100000, 1000000).toString();

      await Prisma.company_Pending.update({
        where: {
          id: data.id,
        },
        data: {
          token: newToken,
          token_expires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      throw new Error(
        "token inválido! outro token será gerado e enviado para seu email!",
      );
    }

    if (new Date() > verify?.token_expires!) {
      const tokenSend = crypto.randomInt(100000, 1000000).toString();

      await Prisma.company_Pending.update({
        where: {
          id: data.id,
        },
        data: {
          token: tokenSend,
          token_expires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      throw new Error("token expirou! outro token será enviado para seu email");
      // enviar token para email
    }

    const userId = await repository.create({
      nomeEmpresa: verify.nomeEmpresa!,
      email: verify.email,
      senha: verify.senha,
      CNPJ: verify.CNPJ,
      telefone: verify.telefone,
      status: true,
    });

    await Prisma.company_Pending.delete({
      where: {
        id: verify.id,
      },
    });

    return userId.id;
  },

  async UpdateAcount(id: number, data: UpdateAcountType) {
    return await repository.update(id, data);
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
