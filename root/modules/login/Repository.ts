import { Prisma } from "../../infra/database/client.js";

export class RepositoryLogin {
  async findByEmail(email: string) {
    return await Prisma.company.findUnique({
      where: {
        email: email,
      },
    });
  }
}
