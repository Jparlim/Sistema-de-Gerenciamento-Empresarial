import { ServicesFinanceiro } from "./Services.js";
import { CreateMovimentacao } from "./schema/SchemaFinanceiro.js";
export const ControllerFinanceiro = {
    async ResumoController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesFinanceiro.GetResumoServices(decode.IDcompany);
    },
    async PerformanceController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        const { meses } = request.query;
        return await ServicesFinanceiro.GetPerformanceServices(decode.IDcompany, meses ? Number(meses) : 6);
    },
    async PrevisaoController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesFinanceiro.GetPrevisaoNegociacaoServices(decode.IDcompany);
    },
    async MovimentacoesController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        const { ano, mes } = request.query;
        const now = new Date();
        return await ServicesFinanceiro.GetMovimentacoesServices(decode.IDcompany, ano ? Number(ano) : now.getFullYear(), mes ? Number(mes) : now.getMonth() + 1);
    },
    async CreateMovimentacaoController(request, reply) {
        const data = CreateMovimentacao.parse(request.body);
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesFinanceiro.CreateMovimentacaoServices(decode.IDcompany, data);
    },
};
