import {
  CreateAcountType,
  UpdateAcountType,
  CreateAcountPendingType,
} from "./schema/SchemaAcount.js";
import { Prisma } from "../../infra/database/client.js";

export class RepositoryCount {
  async create(data: CreateAcountType) {
    return await Prisma.company.create({
      data: data,
    });
  }

  async update(id: number, data: UpdateAcountType) {
    return await Prisma.company.update({ where: { id }, data });
  }

  async delete(id: number) {
    return await Prisma.company.delete({ where: { id: Number(id) } });
  }

  async findAll() {
    return await Prisma.company.findMany({
      include: {
        IA: true,
      },
    });
  }

  async findById(id: number) {
    return await Prisma.company.findUnique({
      where: { id: Number(id) },
      include: { IA: true },
    });
  }
}
