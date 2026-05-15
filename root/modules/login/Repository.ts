import { Prisma } from "../../shared/prisma.js";

export class RepositoryLogin {
  async findByEmail(email: string) {
    return await Prisma.company.findUnique({
      where: {
        email: email,
      },
    });
  }
}
