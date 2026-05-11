import {
  CreateAcount,
  CreateAcountPendingType,
  CreateAcountType,
  UpdateAcountType,
} from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import { Prisma } from "../../shared/prisma.js";
import crypto from "crypto";

const repository = new RepositoryCount();

export const ServicesAcount = {
  async CreateAcount(data: { id: number; token: string }, token: string) {
    const verify = await Prisma.company_Pending.findFirst({
      where: {
        id: data.id,
      },
    });

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
        },
      });

      throw new Error(
        "token inválido! outro token será gerado e enviado para seu email!",
      );
    }

    if (verify?.created_at! > verify?.token_expires!) {
      const tokenSend = crypto.randomInt(100000, 1000000).toString();

      await Prisma.company_Pending.update({
        where: {
          id: data.id,
        },
        data: {
          token: tokenSend,
        },
      });

      console.log(tokenSend);

      throw new Error("token expirou! outro token será enviado para seu email");
      // enviar token para email
    }

    // const IdCount = await Prisma.company.create({
    //   data: {
    //     nomeEmpresa: verify?.nome!,
    //     email: verify?.email!,
    //     senha: verify?.senha!,
    //     CNPJ: verify?.CNPJ!,
    //     numero: verify?.numero!,
    //     status: true,
    //   },
    // });

    // await Prisma.company_Pending.delete({
    //   where: {
    //     id: verify.id,
    //   },
    // });

    // const tokenJwt = App.jwt.sign(
    //   { IDcompany: IdCount.id, role: "admin" },
    //   { expiresIn: "30m" },
    // );

    // const tokenJwt = App.jwt.sign(
    //     { IDcompany: IdCount.id },
    //     { expiresIn: "15m" },
    // )

    // const refreshTokenJwt = App.jwt.sign(
    //     { IDcompany: IdCount.id },
    //     { expiresIn: "7d" }
    // )

    // console.log(tokenJwt);

    // return reply
    // .setCookie("token", tokenJwt, {
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: "strict",
    //     path: '/',
    //     maxAge: 60 * 15
    // })
    // .setCookie("refreshToken", refreshTokenJwt, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //     path: '/',
    //     maxAge: 60 * 60 * 24 * 7
    // }).send({ success:true})

    return repository.create();
  },

  async UpdateAcount(id: number, data: UpdateAcountType) {
    return repository.update(id, data);
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
