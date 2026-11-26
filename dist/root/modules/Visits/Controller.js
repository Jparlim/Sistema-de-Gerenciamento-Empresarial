import { SchemaCreateVisits } from "./schema/SchemaVisits.js";
import { ServicesVisits } from "./Services.js";
export const Controller = {
    async CreateController(request, reply) {
        const data = SchemaCreateVisits.parse(request.body);
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        // tanto adm quanto user podem criar visitas
        return await ServicesVisits.CreateServices(data, decode.IDcompany);
    },
    async DeleteController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!id)
            return reply.status(401).send({ message: "id não fornecido!" });
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        // tanto adm quanto user podem criar visitas
        return ServicesVisits.DeleteServices(id, decode.IDcompany);
    },
    async FindAllController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        const { year, month } = request.query;
        return await ServicesVisits.FindAllServices(decode.IDcompany, year ? Number(year) : undefined, month ? Number(month) : undefined);
    },
    async UpdateController() { },
    async FindByIdController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        if (!id)
            return reply.status(401).send("id não encontrado.");
        return await ServicesVisits.FindByIdServices(id);
    },
};
