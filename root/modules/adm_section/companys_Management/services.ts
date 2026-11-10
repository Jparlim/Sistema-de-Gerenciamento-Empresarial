import { AppError } from "../../../infra/error/AppError.js";
import { repositoryManagement } from "./repository.js";

const repository = new repositoryManagement();

interface ConsultCompanysFilteredService {
  id: number;
  nome: string;
  email: string;
  CNPJ: string;
  telefone: string | null;
  status: boolean;
  statusReason: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
}

interface ConsultCompanyById {
  id: number;
  nome: string;
  email: string;
  CNPJ: string;
  telefone: string;
  status: boolean;
  statusReason: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
  saldo: number;
  IA: {
    nomeEmpresa: string | null;
    nomeIA: string | null;
    instructions: string | null;
  } | null;
}

export const ServiceManagement = {
  async consultCompanysService() {
    const companys = await repository.consultAllCompanys();
    return {
      totalCompanies: companys.length,
      activeCompanies: companys.filter((company) => company.status === true)
        .length,
      inactiveCompanies: companys.filter((company) => company.status === false)
        .length,
      newCompaniesThisMonth: companys.filter((company) => {
        return (
          company.createdAt >=
          new Date(new Date().setDate(new Date().getDate() - 30))
        );
      }).length,
      pendingCompanies: await repository.consultCompanysPending(),
      growth: [],
      recentCompanies: companys
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5),
    };
  },

  async consultAdminMeService(id: number) {
    return await repository.consultAdmin(id);
  },

  async consultCompanysFilteredService(
    search?: string,
    status?: "ACTIVE" | "INACTIVE",
    from?: Date,
    to?: Date,
  ) {
    const statusMap = {
      ACTIVE: true,
      INACTIVE: false,
    };

    const isActiveStatus = statusMap[status!];

    const companys: ConsultCompanysFilteredService[] =
      await repository.consultCompanysFiltered(
        search,
        isActiveStatus,
        from,
        to,
      );

    return {
      items: companys,
      total: companys.length,
      page: 1,
      pageSize: 10,
    };
  },

  async consultCompanyByIdService(id?: number) {
    const data = await repository.consultCompanyById(id);

    return data as ConsultCompanyById;
  },

  async desativarCompanyByIdService(id?: number) {
    const verify = await repository.consultCompanyById(id);

    if (!verify) {
      throw new AppError(404, "empresa não encontrada para a desativação!");
    }

    return await repository.desativarCompanyById(id);
  },
};
