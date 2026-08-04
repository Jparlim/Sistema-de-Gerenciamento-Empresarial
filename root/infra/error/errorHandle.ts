import { FastifyInstance } from "fastify";
import { Message } from "twilio/lib/twiml/MessagingResponse.js";

export async function ErrorHandle(app: FastifyInstance) {
  app.setErrorHandler((err, req, reply) => {
    console.log(err);

    return reply.status(500).send({
      Message: err.message,
    });
  });
}
