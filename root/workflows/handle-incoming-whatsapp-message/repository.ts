import { Prisma } from "../../infra/database/client.js";

export class Repository {
  async getData(number: string) {
    return await Prisma.company.findUnique({
      where: {
        telefone: `+${number}`,
      },
      select: {
        IA: true,
      },
    });
  }
}
