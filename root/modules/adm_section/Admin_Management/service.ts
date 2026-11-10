import { repositoryManagement } from "./repository.js";

const repository = new repositoryManagement();

interface ConsultAdminMeService {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export const serviceManagement = {
  async consultAdminMeService(search?: string) {
    const admin = await repository.consultAdmin(search);
    if (!admin) {
      throw new Error("Administrador não encontrado");
    }
    return admin as ConsultAdminMeService;
  },

  async consultAllAdminsService() {
    const admins = await repository.consultAllAdmins();
    return admins as ConsultAdminMeService[];
  },
};
