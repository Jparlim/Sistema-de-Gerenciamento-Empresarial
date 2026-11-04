import { repositoryManagement } from "./repository.js";

const repository = new repositoryManagement();

export const ServiceManagement = {
  async consultAllCompanysService() {
    const amount = await repository.consultAllCompanys();
    return amount.length;
  },

  async consultActivateCompanysService() {
    const amount = await repository.consultActivateCompanys();
    return amount.length;
  },

  async consultDesactivateCompanysService() {
    const amount = await repository.consultCompanyInactivated();
    return amount.length;
  },

  async consultHowManyCompanys_pendingService() {
    const amount = await repository.consultCompanysPending();
    return amount.length;
  },

  async consultCompanysActivatedService() {
    const amount = await repository.consultCompanysActivated();
    return amount.length;
  },

  async consultCompanysInactivatedService() {
    const amount = await repository.consultCompanyInactivated();
    return amount.length;
  },

  async consultAdminMeService(id: number) {
    return await repository.consultAdmin(id);
  },
};
