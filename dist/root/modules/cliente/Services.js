import { RepositoryClient } from "./Repository.js";
const repository = new RepositoryClient();
export const ServicesClient = {
    async CreateService(data, companyId) {
        const companyData = await repository
            .FindCompanyById(companyId)
            .then((res) => res?.IA);
        if (!companyData)
            throw new Error("Dados da empresa não encontrada!");
        const verify = await repository.FindByNumber(data.contato);
        if (verify)
            throw new Error("cliente já cadastrado!");
        const newData = { ...data, companyId: companyId, dados: companyData.data };
        return await repository.Create(newData);
        // this way to create Estoque is only test, in real project estoque will be create when the user is created
    },
    async CreateServicesWithAI(data) {
        const verify = await repository.FindByNumber(data.contato);
        if (verify)
            throw new Error("cliente já cadastrado!");
        const regexNumber = data.nome.replace(/\D/g, "");
        const newData = { ...data, contato: regexNumber };
        return await repository.Create(newData);
    },
    async UpdateServices(id, data) {
        const filterData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== "" && value !== undefined));
        return await repository.Update(id, filterData);
    },
    async DeleteServices(id) {
        const client = await repository.FindById(id);
        if (!client)
            throw new Error("Cliente não encontrado!");
        return await repository.Delete(id);
    },
    async FindAllServices(companyId) {
        return await repository.FindAll(companyId);
    },
    async FindByIdServices(id) {
        const client = await repository.FindById(id);
        if (!client)
            throw new Error("Cliente não encontrado!");
        return client;
    },
};
