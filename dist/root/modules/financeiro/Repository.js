import { Prisma } from "../../infra/database/client.js";
export class RepositoryFinanceiro {
    async CreateMovimentacao(companyId, data) {
        return await Prisma.$transaction(async (tx) => {
            const movimentacao = await tx.movimentacaoFinanceira.create({
                data: {
                    companyId,
                    descricao: data.descricao,
                    valor: data.valor,
                    tipo: data.tipo,
                },
            });
            await tx.company.update({
                where: { id: companyId },
                data: {
                    saldo: {
                        increment: data.tipo === "ENTRADA" ? data.valor : -data.valor,
                    },
                },
            });
            return movimentacao;
        });
    }
    async FindMovimentacoesByMonth(companyId, start, end) {
        return await Prisma.movimentacaoFinanceira.findMany({
            where: { companyId, createdAt: { gte: start, lt: end } },
            orderBy: { createdAt: "desc" },
        });
    }
    async SumValor(companyId, tipo, start, end) {
        const result = await Prisma.movimentacaoFinanceira.aggregate({
            _sum: { valor: true },
            where: { companyId, tipo, createdAt: { gte: start, lt: end } },
        });
        return result._sum.valor ?? 0;
    }
    async FindSaldo(companyId) {
        const company = await Prisma.company.findUnique({
            where: { id: companyId },
            select: { saldo: true },
        });
        return company?.saldo ?? 0;
    }
    async FindClientesEmNegociacao(companyId) {
        return await Prisma.cliente.findMany({
            where: { companyId, status: "Em Negociação" },
            select: { id: true, nome: true, valorPotencial: true },
        });
    }
}
