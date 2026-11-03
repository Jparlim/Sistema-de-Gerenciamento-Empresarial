import { Prisma } from "../../../database/client.js";

export class repositoryMiddleware {
  async consultAdmin(id: number) {
    return await Prisma.admin.findUnique({
      where: { id: id },
    });
  }
}
