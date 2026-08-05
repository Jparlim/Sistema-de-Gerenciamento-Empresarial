import { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./AppError.js";

export function ErrorHandle(app: FastifyInstance) {
  app.setErrorHandler((err: FastifyError | Error, req, reply) => {
    req.log.error(err);

    if (err instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        message: "Dados inválidos!",
        issues: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    if (typeof (err as { code?: string }).code === "string" && (err as { code: string }).code.startsWith("FAST_JWT")) {
      return reply.status(401).send({
        statusCode: 401,
        message: "sessão expirada ou token inválido!",
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      message: err.message,
    });
  });
}
