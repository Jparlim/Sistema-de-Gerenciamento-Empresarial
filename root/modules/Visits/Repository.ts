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

  async Delete(id: number) {
    return await Prisma.visits.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async FindAll() {
    return await Prisma.visits.findMany();
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
