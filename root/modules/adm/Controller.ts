import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceAdm } from "./Services.js";

interface UpdateAdminRequest {
  idToUpdate: number | undefined;
  newEmail: string | undefined;
  newPassword: string | undefined;
}

export const ControllerAdm = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as {
      email: string;
    };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });

    const result = await ServiceAdm.CreateService(email, decode.id);

    // validar se o email foi enviado com sucesso, caso não, informar outra mensagem.
    if (!result) {
      return reply.status(400).send({
        message: "Erro ao enviar email de confirmação.",
      });
    }

    return reply.status(201).send({
      message:
        "Sucesso! Um email de confirmação foi enviado para o email informado.",
    });
  },

  async findAllController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });

    const result = await ServiceAdm.FindAllAdmins(decode.id);

    return reply.status(200).send({
      message: "Lista de administradores",
      data: result,
    });
  },

  async deleteController(request: FastifyRequest, reply: FastifyReply) {
    const { idToDelete } = request.body as {
      idToDelete: number;
    };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });

    const result = await ServiceAdm.deleteAdmin(decode.id, idToDelete);

    return reply.status(200).send({
      message: "Administrador deletado com sucesso!",
    });
  },

  async updateController(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UpdateAdminRequest;
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });

    const result = await ServiceAdm.updateAdmin(
      decode.id,
      data.idToUpdate!,
      data.newEmail!,
      data.newPassword!,
    );

    return reply.status(200).send({
      message: "Administrador atualizado com sucesso!",
    });
  },

  async findByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });

    const result = await ServiceAdm.findAdminById(decode.id, id);

    return reply.status(200).send({
      message: "Administrador encontrado com sucesso!",
      data: result,
    });
  },
};
