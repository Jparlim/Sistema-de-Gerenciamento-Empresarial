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

  async consultCompanyInactivated() {
    return await Prisma.company.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        status: false,
      },
    });
  }
}
