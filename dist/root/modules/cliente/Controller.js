import { SchemaDataClient } from "./schema/SchemaCliente.js";
import { ServicesClient } from "./Services.js";
export const ControllerClient = {
    async CreateController(request, reply) {
        const data = SchemaDataClient.parse(request.body);
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesClient.CreateService(data, decode.IDcompany);
    },
    async UpdateController(request, reply) {
        const data = SchemaDataClient.parse(request.body);
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!id)
            return reply
                .status(400)
                .send({ message: "ID do cliente não fornecido!" });
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        return await ServicesClient.UpdateServices(id, data);
    },
    async DeleteController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!id)
            return reply
                .status(400)
                .send({ message: "ID do cliente não fornecido!" });
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "Acesso negado!" });
        return await ServicesClient.DeleteServices(id);
    },
    async FindAllController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        return await ServicesClient.FindAllServices(decode.IDcompany);
    },
    async FindByIdController(request, reply) {
        const { id } = request.params;
        if (!id)
            return reply
                .status(400)
                .send({ message: "ID do cliente não fornecido!" });
        return await ServicesClient.FindByIdServices(id);
    },
};
