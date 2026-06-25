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

    const idClient = repository

    const newData = {
      ...data,
      contato: formatNumber,
      data: formatDate,
    //   clientId: id,
    };

    return console.log(newData);
  },

  async UpdateServices() {},

  async FindAllServices() {},

  async FindByIdServices() {},
};
