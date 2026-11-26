import { Prisma } from "../../infra/database/client.js";
import { RepositoryIA } from "./Repository.js";
import { AppError } from "../../infra/error/AppError.js";
const repository = new RepositoryIA();
export const ServicesIA = {
    async CreateServices(data, companyID) {
        const verify = await Prisma.company.findUnique({
            where: {
                id: Number(companyID),
            },
            select: {
                IA: true,
            },
        });
        if (!verify) {
            throw new Error("Empresa não encontrada!");
        }
        if (verify.IA) {
            console.log(verify.IA);
            throw new Error("Configuração de IA já existe para esta empresa!");
        }
        return await repository.create(data, companyID);
    },
    async DeleteServices(id, companyId) {
        const result = await repository.delete(id, companyId);
        if (result.count === 0) {
            throw new AppError(404, "Configuração de IA não encontrada!");
        }
        return { success: true };
    },
    async FindAllServices() {
        return await repository.findAll();
    },
    async FindByCompanyServices(companyId) {
        return await repository.findByCompany(companyId);
    },
    async UpdateServices(id, data) {
        if (!data)
            throw new Error("nenhum dado foi inserido para realizar a atualização!");
        const filterData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== "" && value !== undefined));
        return await repository.update(id, filterData);
    },
};
