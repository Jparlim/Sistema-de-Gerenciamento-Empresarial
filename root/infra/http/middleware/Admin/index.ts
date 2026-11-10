import { FastifyReply, FastifyRequest } from "fastify";
import { repositoryMiddleware } from "./repository.js";

const repository = new repositoryMiddleware();

export async function middlewareValidatorAdm(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const token = req.cookies.refreshToken as string;

    if (!token)
      return rep.status(401).send({ message: "token não encontrado! " });

    const decode = req.server.jwt.verify(token) as {
      id: number;
      email: string;
      role: string;
    };

    const verify = await repository.consultAdmin(decode.id);

    if (!verify)
      return rep.status(404).send({ message: "Admin não encontrado!" });

    if (verify.role !== "ADMIN" && verify.role !== "OWNER") {
      return rep
        .status(403)
        .send({ message: "Você não tem permissão para acessar essa rota!" });
    }
  } catch (error) {
    return rep.status(500).send({ message: "token inválido ou expirado!" });
  }
}

export async function middlewareValidatorOwner(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  try {
    const token = req.cookies.refreshToken as string;

    if (!token)
      return rep.status(401).send({ message: "token não encontrado! " });

    const decode = req.server.jwt.verify(token) as {
      id: number;
    };

    const verify = await repository.consultAdmin(decode.id);

    if (!verify)
      return rep.status(404).send({ message: "Admin não encontrado!" });

    if (verify.role !== "OWNER") {
      return rep
        .status(403)
        .send({ message: "Você não tem permissão para acessar essa rota!" });
    }
  } catch (error) {
    return rep.status(500).send({ message: "token inválido ou expirado!" });
  }
}
