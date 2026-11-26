import { Prisma } from "../../infra/database/client.js";
export class RepositoryClient {
    async Create(data) {
        return await Prisma.cliente.create({
            data: {
                nome: data.nome,
                contato: data.contato,
                resumo: data.resumo,
                status: data.status,
                companyId: data.companyId,
                dados: data.dados,
                valorPotencial: data.valorPotencial,
            },
        });
    }
    async Update(id, data) {
        return await Prisma.cliente.update({
            where: { id: Number(id) },
            data: data,
        });
    }
    async FindCompanyById(id) {
        return await Prisma.company.findUnique({
            where: {
                id: id,
            },
            select: {
                IA: true,
            },
        });
    }
    async FindById(id) {
        return await Prisma.cliente.findUnique({
            where: {
                id: Number(id),
            },
        });
    }
    async FindByNumber(contato) {
        return await Prisma.cliente.findUnique({
            where: {
                contato: contato,
            },
        });
    }
    async FindAll(companyId) {
        return await Prisma.cliente.findMany({
            where: { companyId },
        });
    }
    async Delete(id) {
        return await Prisma.cliente.delete({
            where: {
                id: Number(id),
            },
        });
    }
}
