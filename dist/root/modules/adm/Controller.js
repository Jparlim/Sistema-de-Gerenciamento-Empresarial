import { ServiceAdm } from "./Services.js";
export const ControllerAdm = {
    async CreateController(request, reply) {
        const { email, nome } = request.body;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "ação negada!" });
        const result = await ServiceAdm.CreateService(email, nome, decode.id);
        // validar se o email foi enviado com sucesso, caso não, informar outra mensagem.
        if (!result) {
            return reply.status(400).send({
                message: "Erro ao enviar email de confirmação.",
            });
        }
        return reply.status(201).send({
            message: "Sucesso! Um email de confirmação foi enviado para o email informado.",
        });
    },
    async findAllController(request, reply) {
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "ação negada!" });
        return await ServiceAdm.FindAllAdmins(decode.id);
    },
    async deleteController(request, reply) {
        const { idToDelete } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "ação negada!" });
        const result = await ServiceAdm.deleteAdmin(decode.id, idToDelete);
        return reply.status(200).send({
            message: "Administrador deletado com sucesso!",
        });
    },
    async updateController(request, reply) {
        const data = request.body;
        const { idToUpdate } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "ação negada!" });
        const result = await ServiceAdm.updateAdmin(decode.id, idToUpdate, data.newEmail, data.newPassword);
        return reply.status(200).send({
            message: "Administrador atualizado com sucesso!",
        });
    },
    async findByIdController(request, reply) {
        const { id } = request.params;
        const token = request.cookies.refreshToken;
        if (!token)
            return reply.status(401).send({ message: "token não encontrado! " });
        const decode = request.server.jwt.verify(token);
        if (decode.role !== "admin")
            return reply.status(403).send({ message: "ação negada!" });
        const result = await ServiceAdm.findAdminById(decode.id, id);
        return reply.status(200).send({
            message: "Administrador encontrado com sucesso!",
            data: result,
        });
    },
};
