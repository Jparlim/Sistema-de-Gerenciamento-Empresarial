import { Prisma } from "../../infra/database/client.js";
import {
  SchemaDataClientWithIAType,
  SchemaDataClientType,
  SchemaDataClientUpdateType,
} from "./schema/SchemaCliente.js";

export class RepositoryClient {
  async Create(data: SchemaDataClientWithIAType) {
    return await Prisma.cliente.create({
      data: {
        nome: data.nome,
        contato: data.contato,
        resumo: data.resumo,
        status: data.status,
        companyId: data.companyId,
        dados: data.dados!,
      },
    });
  }

  async Update(id: number, data: SchemaDataClientUpdateType) {
    return await Prisma.cliente.update({
      where: { id: Number(id) },
      data: data,
    });
  }

  async FindCompanyById(id: number) {
    return await Prisma.company.findUnique({
      where: {
        id: id,
      },
      select: {
        IA: true,
      },
    });
  }

  async FindById(id: number) {
    return await Prisma.cliente.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async FindByNumber(contato: string) {
    return await Prisma.cliente.findUnique({
      where: {
        contato: contato,
      },
    });
  }

  async FindAll() {
    return await Prisma.cliente.findMany();
  }

  async Delete(id: number) {
    return await Prisma.cliente.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
