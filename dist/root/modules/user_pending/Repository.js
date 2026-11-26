import { Prisma } from "../../infra/database/client.js";
export class RepositoryCount {
    async createPending(data) {
        return await Prisma.company_Pending.create({
            data: data,
        });
    }
    async delete(id) {
        return await Prisma.company_Pending.delete({ where: { id: Number(id) } });
    }
    async findAll() {
        return await Prisma.company_Pending.findMany();
    }
    async findById(id) {
        return await Prisma.company_Pending.findUnique({ where: { id } });
    }
    async findFirst(data) {
        return await Prisma.company_Pending.findFirst({
            where: {
                OR: [
                    { nome: data.nome },
                    { CNPJ: data.CNPJ },
                    { telefone: data.telefone },
                ],
            },
        });
    }
    async findFirstCompanyExists(data) {
        return await Prisma.company.findFirst({
            where: {
                OR: [
                    { nome: data.nome },
                    { CNPJ: data.CNPJ },
                    { telefone: data.telefone },
                ],
            },
        });
    }
}
