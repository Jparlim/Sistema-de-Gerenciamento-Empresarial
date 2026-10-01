import { Prisma } from "../../infra/database/client.js";

export class RepositoryAdm {
  async CreateAdmin(email: string, senha: string) {
    return await Prisma.admin.create({
      data: {
        email: email,
        senha: senha,
      },
    });
  }

  async FindAdminById(id: number) {
    return await Prisma.admin.findUnique({
      where: {
        id: id,
      },
    });
  }

  async FindAdminByEmail(email: string) {
    return await Prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
  }

  async FindAllAdmins() {
    return await Prisma.admin.findMany();
  }

  async deleteAdmin(id: number) {
    return await Prisma.admin.delete({
      where: {
        id: id,
      },
    });
  }

  async updateAdmin(id: number, newEmail: string, newPassword: string) {
    return await Prisma.admin.update({
      where: {
        id: id,
      },
      data: {
        email: newEmail,
        senha: newPassword,
      },
    });
  }
}
