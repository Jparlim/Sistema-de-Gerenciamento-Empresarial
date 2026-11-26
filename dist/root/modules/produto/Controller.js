import { CreateToController, UpdateRepository, } from "./schema/SchemaProduto.js";
import { ServicesProduto } from "./Services.js";
export const ControllerProduto = {
    async CreateController(request, reply) {
        const data = CreateToController.parse(request.body);
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não enviado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesProduto.CreateServices({
            ...data,
            estoqueId: decode.estoqueId,
        });
    },
    async UpdateController(request, reply) {
        const data = UpdateRepository.parse(request.body);
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não enviado!" });
        if (!id)
            return reply
                .status(400)
                .send({ message: "id do produto não informado!" });
        const decode = request.server.jwt.decode(token);
        // if (decode.role !== "admin")
        //   return reply.status(401).send({ message: "acesso negado!" });
        return await ServicesProduto.UpdateServices(decode.estoqueId, id, data);
    },
    async DeleteController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!id)
            return reply
                .status(400)
                .send({ message: "id do produto não informado!" });
        if (!token)
            return reply.status(401).send({ message: "token não enviado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesProduto.DeleteServices(decode.estoqueId, id);
    },
    async FindAllController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não enviado!" });
        const decode = request.server.jwt.decode(token);
        return await ServicesProduto.FindAllServices(decode.estoqueId);
    },
    async FindByIdController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        // deixar esta função em observação, pois no futuro ou no momento podemos acrescentar um filtro para encontrar produto, e talvez usar esta função
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        // if (decode.role !== "admin")
        //   return reply.status(403).send({ message: "Acesso negado!" });
        if (!id)
            return reply
                .status(400)
                .send({ message: "id do produto não informado!" });
        return await ServicesProduto.FindByIdServices(decode.estoqueId, id);
    },
};
