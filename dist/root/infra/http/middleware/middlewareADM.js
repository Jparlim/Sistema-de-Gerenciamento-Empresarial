export function middlewareValidatorAdm(req, rep) {
    const token = req.cookies.refreshToken;
    if (!token)
        return rep.status(401).send({ message: "token não encontrado! " });
    const decode = req.server.jwt.verify(token);
    if (decode.role !== "")
        return rep.status(403).send({ message: "Acesso negado!" });
}
