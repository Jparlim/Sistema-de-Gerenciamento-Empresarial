import { Prisma } from "../../infra/database/client.js";

export class RepositoryLogin {
  async findUserByEmail(email: string) {
    return await Prisma.company.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findAdminByEmail(email: string) {
    return await Prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createForgotPasswordEntry(
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return await Prisma.forgotPassword.create({
      data: {
        email: email,
        token: tokenHash,
        token_expires: expiresAt,
      },
    });
  }

  async findForgotPasswordEntry(token: string) {
    return await Prisma.forgotPassword.findFirst({
      where: {
        token: token,
      },
    });
  }

  async changePassword(email: string, password: string) {
    return await Prisma.company.update({
      where: { email: email },
      data: {
        senha: password,
      },
    });
  }
}
