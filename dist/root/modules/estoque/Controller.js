import { ServicesEstoque } from "./Services.js";
export const ControllerEstoque = {
    async CreateController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesEstoque.CreateServices(decode.IDcompany);
    },
    async UpdateController(request, reply) { },
    async DeleteController(request, reply) {
        const { id } = request.params;
        if (!id)
            return reply.status(401).send({ message: "id não fornecido!" });
        return await ServicesEstoque.DeleteServices(id);
    },
    async FindAllController(request, reply) {
        return await ServicesEstoque.FindAllServices();
    },
    async FindByIdController(request, reply) {
        const { id } = request.params;
        if (!id)
            return reply.status(401).send({ message: "id não fornecido!" });
        return await ServicesEstoque.FindByIdServices(id);
    },
};
