import { Prisma } from "../../infra/database/client.js";
import { SchemaCreateIAType, SchemaUpdateIAType } from "./schema/schemaIA.js";

export class RepositoryIA {
  async create(dados: SchemaCreateIAType, companyID: number) {
    return await Prisma.iA.create({
      data: {
        company: {
          connect: { id: companyID },
        },
        instructions: dados.instructions,
        nomeEmpresa: dados.nomeEmpresa,
        nomeIA: dados.nomeIA,
        data: dados.data ?? undefined,
      },
    });
  }

  async delete(id: number, companyId: number) {
    return await Prisma.iA.deleteMany({
      where: {
        id,
        companyId,
      },
    });
  }

  async findAll() {
    return await Prisma.iA.findMany();
  }

  async findByCompany(companyId: number) {
    return await Prisma.iA.findUnique({
      where: { companyId },
    });
  }

  async update(id: number, data: SchemaUpdateIAType) {
    return await Prisma.iA.update({
      where: { companyId: id },
      data,
    });
  }
}
