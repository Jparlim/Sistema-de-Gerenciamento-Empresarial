import { Prisma } from "../../../infra/database/client.js";

interface actorIdODT {
  id: number;
  nome: string;
  email: string;
}

export class repositoryManager {
  async filterHistoric(
    search: string,
    actor: actorIdODT,
    action: string,
    from: string,
    to: string,
  ) {
    await Prisma.adminAuditLog.findMany({
      where: {},
    });
  }

  async filterActors() {
    return await Prisma.admin.findMany();
  }

  async filterActorsById(id: number) {
    return await Prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
  }
}
