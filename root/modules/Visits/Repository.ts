import { Prisma } from "../../infra/database/client.js";
import {
  SchemaCreateVisitsType,
  SchemaUpdateVisitsType,
} from "./schema/SchemaVisits.js";

export class Repository {
  async Create(data: SchemaCreateVisitsType, id: number) {
    return await Prisma.visits.create({
      data: { ...data, clientId: id },
    });
  }

  async Update(id: number, data: SchemaUpdateVisitsType) {
    await Prisma.visits.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async Delete(id: number, companyId: number) {
    const { count } = await Prisma.visits.deleteMany({
      where: {
        id: Number(id),
        client: { companyId },
      },
    });

    return count > 0;
  }

  async FindAll(companyId: number, year?: number, month?: number) {
    const monthPrefix =
      year && month
        ? `${year}-${String(month).padStart(2, "0")}`
        : undefined;

    return await Prisma.visits.findMany({
      where: {
        client: { companyId },
        ...(monthPrefix ? { data: { startsWith: monthPrefix } } : {}),
      },
      orderBy: [{ data: "asc" }, { hora: "asc" }],
    });
  }

  async FindById(id: number) {
    return await Prisma.visits.findUnique({
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
}
