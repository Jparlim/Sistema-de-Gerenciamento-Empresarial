import { repositoryMiddleware } from "./repository.js";
const repository = new repositoryMiddleware();
export function isActiveOwner(admin) {
    return admin?.ativo === true && admin.role === "OWNER";
}
export async function middlewareValidatorAdm(req, rep) {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            return rep.status(401).send({ message: "Sessão administrativa ausente." });
        const decode = req.server.jwt.verify(token);
        if (typeof decode.id !== "number" || !Number.isSafeInteger(decode.id) || decode.id < 1) {
            return rep.status(401).send({ message: "Sessão administrativa inválida." });
        }
        const admin = await repository.consultAdmin(decode.id);
        if (!admin)
            return rep.status(401).send({ message: "Sessão administrativa inválida." });
        if (admin.ativo !== true)
            return rep.status(403).send({ message: "Este administrador está desativado." });
        if (admin.role !== "ADMIN" && admin.role !== "OWNER") {
            return rep.status(403).send({ message: "Você não tem permissão para acessar essa rota!" });
        }
    }
    catch {
        return rep.status(401).send({ message: "Sessão administrativa inválida." });
    }
}
export async function middlewareValidatorOwner(req, rep) {
    const token = req.cookies.refreshToken;
    if (!token) {
        return rep.status(401).send({ message: "Sessão administrativa ausente." });
    }
    let adminId;
    try {
        const decode = req.server.jwt.verify(token);
        if (typeof decode.id !== "number" ||
            !Number.isSafeInteger(decode.id) ||
            decode.id < 1) {
            return rep.status(401).send({ message: "Sessão administrativa inválida." });
        }
        adminId = decode.id;
    }
    catch {
        return rep.status(401).send({ message: "Sessão administrativa inválida." });
    }
    const admin = await repository.consultAdmin(adminId);
    if (!admin) {
        return rep.status(401).send({ message: "Sessão administrativa inválida." });
    }
    if (!isActiveOwner(admin)) {
        return rep
            .status(403)
            .send({ message: "Você não tem permissão para acessar essa rota!" });
    }
}
