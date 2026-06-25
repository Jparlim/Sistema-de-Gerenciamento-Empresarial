import { Prisma } from "../../infra/database/client.js";
import {
  SchemaCreateVisitsType,
  SchemaUpdateVisitsType,
} from "./schema/SchemaVisits.js";

export class Repository {
  async Create(data: SchemaCreateVisitsType, id: number) {
    await Prisma.visits.create({
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
    await Prisma.visits.delete({
      where: {
        id: id,
      },
    });
  }

  async FindAll() {
    await Prisma.visits.findMany();
  }

  async FindById(id: number) {
    await Prisma.visits.findUnique({
      where: {
        id: id,
      },
    });
  }

  async FindByNumber(contato: number) {
    // await Prisma.cliente.findUnique();
  }
}

// contato: contato
// ver se da para deixar padrão o contato do cliente como number
