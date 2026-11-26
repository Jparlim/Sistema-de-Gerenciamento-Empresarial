import { Prisma } from "../../../infra/database/client.js";
export class repositoryManagement {
    async consultAdmin(id) {
        return await Prisma.admin.findUnique({
            where: { id: id },
        });
    }
    async consultAllCompanys() {
        return await Prisma.company.findMany();
    }
    async consultCompanysPending() {
        return await Prisma.company_Pending.findMany();
    }
    async consultCompanysFiltered(search, status, from, to) {
        return await Prisma.company.findMany({
            where: {
                nome: search,
                email: search,
                CNPJ: search,
                status: status,
                createdAt: {
                    gte: from,
                    lte: to,
                },
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        });
    }
    async consultCompanyById(id) {
        return await Prisma.company.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                nome: true,
                email: true,
                CNPJ: true,
                telefone: true,
                status: true,
                statusReason: true,
                createdAt: true,
                lastLoginAt: true,
                saldo: true,
                IA: {
                    select: {
                        nomeEmpresa: true,
                        nomeIA: true,
                        instructions: true,
                    },
                },
            },
        });
    }
    async desativarCompanyById(id) {
        return await Prisma.company.delete({
            where: {
                id: Number(id),
            },
        });
    }
}
