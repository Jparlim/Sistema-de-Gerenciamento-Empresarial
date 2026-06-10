import { Prisma } from "../../infra/database/client.js";
import { SchemaDataClientType } from "./schema/SchemaCliente.js";

export class RepositoryClient {
  async Create(data: SchemaDataClientType) {
    return await Prisma.cliente.create({
      data: {
        nome: data.nome,
        contato: data.contato,
        status: data.status,
        companyId: data.companyId,
      },
    });
  }
}
