import { FastifyInstance } from "fastify";
import { ControllerFinanceiro } from "./Controller.js";

export function Financeiro_Route(app: FastifyInstance) {
  app.get("/financeiro/resumo", ControllerFinanceiro.ResumoController);
  app.get("/financeiro/performance", ControllerFinanceiro.PerformanceController);
  app.get(
    "/financeiro/previsao-negociacao",
    ControllerFinanceiro.PrevisaoController,
  );
  app.get(
    "/financeiro/movimentacoes",
    ControllerFinanceiro.MovimentacoesController,
  );
  app.post(
    "/financeiro/movimentacao",
    ControllerFinanceiro.CreateMovimentacaoController,
  );
}
