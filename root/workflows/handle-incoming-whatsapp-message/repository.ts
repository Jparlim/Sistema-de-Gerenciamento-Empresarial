import { Prisma } from "../../infra/database/client.js";

export class Repository {
  async getData(number: string) {
    return await Prisma.company.findUnique({
      where: {
        telefone: `+${number}`,
      },
      include: {
        IA: true,
      },
    });
  }
}
