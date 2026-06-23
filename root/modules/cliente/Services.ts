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

    if (!companyData) throw new Error("Dados da empresa não encontrada!");

    const newData = { ...data, companyId: companyId, dados: companyData.data };

    return await repository.Create(newData);
  },

  async CreateServicesWithAI(data: SchemaDataClientWithIAType) {
    console.log(data);
  },

  async UpdateServices(id: number, data: SchemaDataClientType) {
    const filterData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    ) as SchemaDataClientType;

    await repository.Update(id, filterData);
  },

  async DeleteServices(id: number) {
    const client = await repository.FindById(id);

    if (!client) throw new Error("Cliente não encontrado!");

    return await repository.Delete(id);
  },

  async FindAllServices() {
    return await repository.FindAll();
  },

  async FindByIdServices(id: number) {
    const client = await repository.FindById(id);

    if (!client) throw new Error("Cliente não encontrado!");
    return client;
  },
};
