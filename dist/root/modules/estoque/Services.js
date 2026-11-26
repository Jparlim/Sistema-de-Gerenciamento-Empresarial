import { Repository } from "./Repository.js";
const repository = new Repository();
export const ServicesEstoque = {
    async CreateServices(companyId) {
        const verify = await repository.FindByCompanyId(companyId);
        if (verify)
            throw new Error("já existe um estoque para a empresa!");
        return await repository.Create(companyId);
    },
    async UpdateServices() { },
    async DeleteServices(companyId) {
        const verify = await repository.FindById(companyId);
        if (!verify)
            throw new Error("Estoque não encontrado!");
        return await repository.Delete(companyId);
    },
    async FindAllServices() {
        return await repository.FindAll();
    },
    async FindByIdServices(companyId) {
        return await repository.FindById(companyId);
    },
    async FindByCompanyIdServices(companyId) {
        return await repository.FindByCompanyId(companyId);
    },
};
