import { Prisma } from "../../../infra/database/client.js";

export class repositoryManagement {
  async consultAdmin(search?: string) {
    return await Prisma.admin.findUnique({
      where: {
        // foi tirado o name daqui, talvez mude na lógica
        email: search,
      },
    });
  }

  async consultAllAdmins() {
    return await Prisma.admin.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }
}
