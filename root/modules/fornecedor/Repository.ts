import { Prisma } from "../../infra/database/client.js";
import {
  CreateControllerType,
  updateControllerType,
} from "./schema/SchemaProduto.js";

export class Repository {
  async Create(data: CreateControllerType) {
    return await Prisma.fornecedor.create({
      data: data,
    });
  }
  async Update(data: updateControllerType, id: number) {
    return await Prisma.fornecedor.update({
      where: {
        id: Number(id),
      },
      data,
    });
  }
  async Delete(id: number) {
    return await Prisma.fornecedor.delete({
      where: {
        id: Number(id),
      },
    });
  }
  async FindAll() {
    return await Prisma.fornecedor.findMany();
  }
  async FindById(id: number) {
    return await Prisma.fornecedor.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
  async FindByData(data: CreateControllerType) {
    return await Prisma.fornecedor.findFirst({
      where: {
        OR: [
          { CNPJ: data.CNPJ },
          { contato: data.contato },
          { nome: data.nome },
        ],
      },
    });
  }
}
