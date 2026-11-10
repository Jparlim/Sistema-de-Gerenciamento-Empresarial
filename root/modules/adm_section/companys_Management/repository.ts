import { TrunkContextImpl } from "twilio/lib/rest/routes/v2/trunk.js";
import { Prisma } from "../../../infra/database/client.js";

export class repositoryManagement {
  async consultAdmin(id: number) {
    return await Prisma.admin.findUnique({
      where: { id: id },
    });
  }

  async consultAllCompanys() {
    return await Prisma.company.findMany();
  }

  async consultCompanysPending() {
    return await Prisma.company_Pending.findMany();
  }

  async consultCompanysFiltered(
    search?: string,
    status?: boolean,
    from?: Date,
    to?: Date,
  ) {
    return await Prisma.company.findMany({
      where: {
        nome: search,
        email: search,
        CNPJ: search,
        status: status,
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
  }

  async consultCompanyById(id?: number) {
    return await Prisma.company.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        CNPJ: true,
        telefone: true,
        status: true,
        statusReason: true,
        createdAt: true,
        lastLoginAt: true,
        saldo: true,
        IA: {
          select: {
            nomeEmpresa: true,
            nomeIA: true,
            instructions: true,
          },
        },
      },
    });
  }

  async desativarCompanyById(id?: number) {
    return await Prisma.company.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
