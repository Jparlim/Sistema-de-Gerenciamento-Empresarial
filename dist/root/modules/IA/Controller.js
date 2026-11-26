import { SchemaCreateIA, SchemaUpdateIA } from "./schema/schemaIA.js";
import { ServicesIA } from "./Services.js";
import { AppError } from "../../infra/error/AppError.js";
function getCompanyId(request) {
    const token = request.cookies.refreshToken;
    if (!token)
        throw new AppError(401, "token não encontrado!");
    const decoded = request.server.jwt.verify(token);
    const companyId = decoded.IDcompany;
    if (decoded.role !== "user" ||
        typeof companyId !== "number" ||
        !Number.isSafeInteger(companyId) ||
        companyId <= 0) {
        throw new AppError(403, "Acesso negado!");
    }
    return companyId;
}
export const ControllerIA = {
    async CreateController(request) {
        const data = SchemaCreateIA.parse(request.body);
        return await ServicesIA.CreateServices(data, getCompanyId(request));
    },
    async DeleteController(request) {
        const rawId = request.params.id;
        const id = Number(rawId);
        if (!Number.isSafeInteger(id) || id <= 0)
            throw new AppError(400, "Identificador de configuração inválido!");
        return await ServicesIA.DeleteServices(id, getCompanyId(request));
    },
    async FindAllController(request) {
        return await ServicesIA.FindByCompanyServices(getCompanyId(request));
    },
    async UpdateController(request) {
        const data = SchemaUpdateIA.parse(request.body);
        return await ServicesIA.UpdateServices(getCompanyId(request), data);
    },
};
