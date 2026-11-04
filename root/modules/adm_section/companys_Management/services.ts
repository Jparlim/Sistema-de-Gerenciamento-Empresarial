import { repositoryManagement } from "./repository.js";

const repository = new repositoryManagement();

export const ServiceManagement = {
  async consultCompanysService(id: number) {
    const verifyAdmin = await repository.consultAdmin(id);

    if (!verifyAdmin) {
      throw new Error("Administrador não encontrado.");
    }

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
};

// {
//   totalCompanies: number;          // total de empresas
//   activeCompanies: number;         // empresas ativas
//   inactiveCompanies: number;       // empresas desativadas
//   newCompaniesThisMonth: number;   // novos cadastros no mês atual
//   pendingCompanies: number | null; // cadastros aguardando confirmação
//   growth: { month: string; count: number }[]; // evolução mensal
//   recentCompanies: Company[];      // empresas cadastradas recentemente
// }
