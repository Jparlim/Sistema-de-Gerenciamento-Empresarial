import { CreateAcountPendingType } from "./schema/SchemaAcount.js";
import { prisma } from "../../../src/Prisma_Client/index.js";

export class RepositoryCount {
  async createPending(data: CreateAcountPendingType) {
    return await prisma.company_Pending.create({
      data: data,
    });
  }

  async delete(id: number) {
    return await prisma.company.delete({ where: { id } });
  }

  async findAll() {
    return await prisma.company.findMany();
  }

  async findById(id: number) {
    return await prisma.company.findUnique({ where: { id } });
  }
}
