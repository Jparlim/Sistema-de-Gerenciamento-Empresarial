import {
  CreateAcountPendingType,
  CreateAcountPendingOfBodyType,
} from "./schema/SchemaAcount.js";
import { Prisma } from "../../infra/database/client.js";

export class RepositoryCount {
  async createPending(data: CreateAcountPendingType) {
    return await Prisma.company_Pending.create({
      data: data,
    });
  }

  async delete(id: number) {
    return await Prisma.company_Pending.delete({ where: { id: Number(id) } });
  }

  async findAll() {
    return await Prisma.company_Pending.findMany();
  }

  async findById(id: number) {
    return await Prisma.company_Pending.findUnique({ where: { id } });
  }
}
