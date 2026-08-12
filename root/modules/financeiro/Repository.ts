import { Prisma } from "../../infra/database/client.js";
import { CreateMovimentacaoType } from "./schema/SchemaFinanceiro.js";

export class RepositoryFinanceiro {
  async CreateMovimentacao(companyId: number, data: CreateMovimentacaoType) {
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

  async FindMovimentacoesByMonth(companyId: number, start: Date, end: Date) {
    return await Prisma.movimentacaoFinanceira.findMany({
      where: { companyId, createdAt: { gte: start, lt: end } },
      orderBy: { createdAt: "desc" },
    });
  }

  async SumValor(
    companyId: number,
    tipo: "ENTRADA" | "SAIDA",
    start: Date,
    end: Date,
  ) {
    const result = await Prisma.movimentacaoFinanceira.aggregate({
      _sum: { valor: true },
      where: { companyId, tipo, createdAt: { gte: start, lt: end } },
    });

    return result._sum.valor ?? 0;
  }

  async FindSaldo(companyId: number) {
    const company = await Prisma.company.findUnique({
      where: { id: companyId },
      select: { saldo: true },
    });

    return company?.saldo ?? 0;
  }

  async FindClientesEmNegociacao(companyId: number) {
    return await Prisma.cliente.findMany({
      where: { companyId, status: "Em Negociação" },
      select: { id: true, nome: true, valorPotencial: true },
    });
  }
}
