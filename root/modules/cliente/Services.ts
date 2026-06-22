import {
  SchemaDataClientType,
  SchemaDataClientWithIAType,
} from "./schema/SchemaCliente.js";
import { RepositoryClient } from "./Repository.js";

const repository = new RepositoryClient();

export const ServicesClient = {
  async CreateService(data: SchemaDataClientType, companyId: number) {
    const companyData = await repository
      .FindCompanyById(companyId)
      .then((res) => res?.IA);

    if (!companyData) throw new Error("Empresa não encontrada!");

    const newData = { ...data, companyId: companyId, dados: companyData.data };

    return await repository.Create(newData);
  },

  async CreateServicesWithAI(data: SchemaDataClientWithIAType) {
    console.log(data);
  },
};
