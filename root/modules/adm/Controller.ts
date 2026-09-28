import { FastifyReply, FastifyRequest } from "fastify";

export const ControllerAdm = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      email: string;
      id: number;
      role: string;
    };

    if(decode.role !== "admin")
      return reply.status(403).send({ message: "ação negada!" });
    
    

}}
