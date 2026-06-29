import { Repository } from "./Repository.js";
import { SchemaCreateVisitsType } from "./schema/SchemaVisits.js";

const repository = new Repository();

export const ServicesVisits = {
  async CreateServices(data: SchemaCreateVisitsType) {
    const formatNumber = data.contato.replace(/\D/g, "");
    const formatDate = data.data.replace(
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      "",
    );

    const idClient = await repository.FindByNumber(formatNumber);

    if (!idClient) throw new Error("cliente não encontrado!");

    const newData = {
      ...data,
      contato: formatNumber,
      data: formatDate,
    };

    return await repository.Create(newData, idClient?.id!);
  },

  async DeleteServices(id: number) {
    const verify = await repository.Delete(id);

    if (!verify) throw new Error("visita não contrada para fazer a remoção!");

    return verify;
  },

  async UpdateServices() {},

  async FindAllServices() {
    return await repository.FindAll();
  },

  async FindByIdServices(id: number) {
    const verify = await repository.FindById(id);

    if (!verify) throw new Error("visita não encontrada!");

    return verify;
  },
};
