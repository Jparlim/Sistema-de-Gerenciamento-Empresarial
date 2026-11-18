import type { Prisma as PrismaTypes } from "@prisma/client";
import { Prisma as PrismaClient } from "../../../infra/database/client.js";
import {
  AuditLogQuery,
  createAuditLogWhere,
  filterAndPaginateAuditLogs,
} from "./query.js";

export class repositoryManager {
  async filterActors() {
    return PrismaClient.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: { id: "asc" },
    });
  }

  async filterHistoric(query: AuditLogQuery) {
    const where: PrismaTypes.AdminAuditLogWhereInput =
      createAuditLogWhere(query);

    const records = await PrismaClient.adminAuditLog.findMany({
      where,
      select: {
        id: true,
        actorId: true,
        actor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        action: true,
        targetType: true,
        targetId: true,
        createdAt: true,
        details: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return filterAndPaginateAuditLogs(records, query);
  }
}
