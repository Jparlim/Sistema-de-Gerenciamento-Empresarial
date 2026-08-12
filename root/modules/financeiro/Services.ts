import { RepositoryFinanceiro } from "./Repository.js";
import { CreateMovimentacaoType } from "./schema/SchemaFinanceiro.js";

const repository = new RepositoryFinanceiro();

function monthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

export const ServicesFinanceiro = {
  async CreateMovimentacaoServices(
    companyId: number,
    data: CreateMovimentacaoType,
  ) {
    return await repository.CreateMovimentacao(companyId, data);
  },

  async GetResumoServices(companyId: number) {
    const now = new Date();
    const { start, end } = monthRange(now.getFullYear(), now.getMonth() + 1);

    const [saldoAtual, entradaMes, saidaMes] = await Promise.all([
      repository.FindSaldo(companyId),
      repository.SumValor(companyId, "ENTRADA", start, end),
      repository.SumValor(companyId, "SAIDA", start, end),
    ]);

    return {
      saldoAtual,
      entradaMes,
      saidaMes,
      lucroLiquido: entradaMes - saidaMes,
    };
  },

  // "previsto" para cada mês é a média móvel dos até 3 meses reais anteriores
  // (não existe meta cadastrada em lugar nenhum do sistema hoje).
  async GetPerformanceServices(companyId: number, meses: number) {
    const now = new Date();
    const pontos: { mes: string; real: number }[] = [];

    for (let i = meses - 1; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const { start, end } = monthRange(ref.getFullYear(), ref.getMonth() + 1);
      const real = await repository.SumValor(companyId, "ENTRADA", start, end);
      pontos.push({
        mes: `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`,
        real,
      });
    }

    return pontos.map((ponto, index) => {
      const anteriores = pontos
        .slice(Math.max(0, index - 3), index)
        .map((p) => p.real);
      const previsto =
        anteriores.length > 0
          ? anteriores.reduce((acc, v) => acc + v, 0) / anteriores.length
          : ponto.real;

      return { ...ponto, previsto: Number(previsto.toFixed(2)) };
    });
  },

  async GetPrevisaoNegociacaoServices(companyId: number) {
    const clientes = await repository.FindClientesEmNegociacao(companyId);
    const total = clientes.reduce((acc, c) => acc + (c.valorPotencial ?? 0), 0);

    return { total, clientes };
  },

  async GetMovimentacoesServices(
    companyId: number,
    year: number,
    month: number,
  ) {
    const { start, end } = monthRange(year, month);
    return await repository.FindMovimentacoesByMonth(companyId, start, end);
  },
};
