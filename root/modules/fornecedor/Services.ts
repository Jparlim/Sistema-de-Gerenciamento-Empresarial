import { Repository } from "./Repository.js";
import { CreateControllerType } from "./schema/SchemaProduto.js";

const repository = new Repository();

export const ServicesFornecedor = {
  async CreateServices(data: CreateControllerType) {
    const verify = await repository.FindByData(data);

    if (verify) throw new Error("fornecedor já cadastrado!");

    return await repository.Create(data);
  },

  async UpdateServices() {},

  async DeleteServices() {},

  async FindAllServices() {
    return await repository.FindAll();
  },

  async FindByIdServices() {},
};
