import { Prisma } from "../../infra/database/client.js";
import { SchemaDataClientWithIAType } from "./schema/SchemaCliente.js";

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
}
