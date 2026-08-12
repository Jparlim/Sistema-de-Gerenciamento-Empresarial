import { FastifyReply, FastifyRequest } from "fastify";
import { ServicesFinanceiro } from "./Services.js";
import { CreateMovimentacao } from "./schema/SchemaFinanceiro.js";

export const ControllerFinanceiro = {
  async ResumoController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesFinanceiro.GetResumoServices(decode.IDcompany);
  },

  async PerformanceController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };
    const { meses } = request.query as { meses?: string };

    return await ServicesFinanceiro.GetPerformanceServices(
      decode.IDcompany,
      meses ? Number(meses) : 6,
    );
  },

  async PrevisaoController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesFinanceiro.GetPrevisaoNegociacaoServices(
      decode.IDcompany,
    );
  },

  async MovimentacoesController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };
    const { ano, mes } = request.query as { ano?: string; mes?: string };
    const now = new Date();

    return await ServicesFinanceiro.GetMovimentacoesServices(
      decode.IDcompany,
      ano ? Number(ano) : now.getFullYear(),
      mes ? Number(mes) : now.getMonth() + 1,
    );
  },

  async CreateMovimentacaoController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const data = CreateMovimentacao.parse(request.body);
    const token = request.cookies.refreshToken as string;
    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesFinanceiro.CreateMovimentacaoServices(
      decode.IDcompany,
      data,
    );
  },
};
