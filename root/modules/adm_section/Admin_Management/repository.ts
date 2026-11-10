import { Prisma } from "../../../infra/database/client.js";

export class repositoryManagement {
  async consultAdmin(search?: string) {
    return await Prisma.admin.findUnique({
      where: {
        name: search,
        email: search,
      },
    });
  }

  async consultAllAdmins() {
    return await Prisma.admin.findMany();
  }
}
