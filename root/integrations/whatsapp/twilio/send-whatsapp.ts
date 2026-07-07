import type { FastifyInstance } from "fastify";
import { twilioWhatsappSchema } from "./schema/send-whatsapp-schema.js";
import { handleIncomingWhatsappMessage } from "../../../workflows/handle-incoming-whatsapp-message/service.js";
import { createMessage } from "./createMessage.js";

export async function sendWhatsappTwilio(app: FastifyInstance) {
  app.post("/whatsapp", async (request, reply) => {
    const data = twilioWhatsappSchema.parse(request.body);

    const newWaId = data.WaId + "-" + data.To;

    const result = await handleIncomingWhatsappMessage(
      newWaId,
      data.From,
      data.To,
      {
        role: "user",
        content: data.Body,
      },
    );

    return await createMessage(result.response, data.From);
  });

  app.get("/whatsapp", (request, reply) => {
    reply.send(
      "WhatsApp endpoint is working! Please send a POST request to receive a message response.",
    );
  });
}
