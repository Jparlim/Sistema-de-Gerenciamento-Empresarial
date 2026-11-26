import { Repository } from "./Repository.js";
import { AppError } from "../../infra/error/AppError.js";
const repository = new Repository();
export const ServicesVisits = {
    async CreateServices(data, callerCompanyId) {
        const formatNumber = data.contato.replace(/\D/g, "");
        const idClient = await repository.FindByNumber(formatNumber);
        if (!idClient || idClient.companyId !== callerCompanyId)
            throw new AppError(404, "cliente não encontrado!");
        const newData = {
            ...data,
            contato: formatNumber,
        };
        return await repository.Create(newData, idClient.id);
    },
    async DeleteServices(id, companyId) {
        const verify = await repository.Delete(id, companyId);
        if (!verify)
            throw new AppError(404, "visita não encontrada para fazer a remoção!");
        return verify;
    },
    async UpdateServices() { },
    async FindAllServices(companyId, year, month) {
        return await repository.FindAll(companyId, year, month);
    },
    async FindByIdServices(id) {
        const verify = await repository.FindById(id);
        if (!verify)
            throw new Error("visita não encontrada!");
        return verify;
    },
};
