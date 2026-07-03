import { Prisma } from "../../infra/database/client.js";
import { CreateControllerType } from "./schema/SchemaProduto.js";

export class Repository {
  async Create(data: CreateControllerType) {
    return await Prisma.fornecedor.create({
      data: data,
    });
  }
  async Update() {}
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
    return await Prisma.produto.findUnique({
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
