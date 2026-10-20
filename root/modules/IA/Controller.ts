import { FastifyRequest } from "fastify";
import { SchemaCreateIA, SchemaUpdateIA } from "./schema/schemaIA.js";
import { ServicesIA } from "./Services.js";
import { AppError } from "../../infra/error/AppError.js";

type CompanyToken = {
  IDcompany: number;
  role: string;
};

function getCompanyId(request: FastifyRequest): number {
  const token = request.cookies.refreshToken;

  if (!token) throw new AppError(401, "token não encontrado!");

  const decoded = request.server.jwt.verify(token) as Partial<CompanyToken>;
  const companyId = decoded.IDcompany;

  if (
    decoded.role !== "user" ||
    typeof companyId !== "number" ||
    !Number.isSafeInteger(companyId) ||
    companyId <= 0
  ) {
    throw new AppError(403, "Acesso negado!");
  }

  return companyId;
}

export const ControllerIA = {
  async CreateController(request: FastifyRequest) {
    const data = SchemaCreateIA.parse(request.body);
    return await ServicesIA.CreateServices(data, getCompanyId(request));
  },

  async DeleteController(request: FastifyRequest) {
    const rawId = (request.params as { id: string }).id;
    const id = Number(rawId);

    if (!Number.isSafeInteger(id) || id <= 0)
      throw new AppError(400, "Identificador de configuração inválido!");

    return await ServicesIA.DeleteServices(id, getCompanyId(request));
  },

  async FindAllController(request: FastifyRequest) {
    return await ServicesIA.FindByCompanyServices(getCompanyId(request));
  },

  async UpdateController(request: FastifyRequest) {
    const data = SchemaUpdateIA.parse(request.body);
    return await ServicesIA.UpdateServices(getCompanyId(request), data);
  },
};
