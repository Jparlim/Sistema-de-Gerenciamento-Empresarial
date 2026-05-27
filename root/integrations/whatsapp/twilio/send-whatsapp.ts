import type { FastifyInstance } from "fastify";
import { twilioWhatsappSchema } from "./schema/send-whatsapp-schema.js";
import { handleIncomingWhatsappMessage } from "../../../workflows/handle-incoming-whatsapp-message/service.js";

export async function sendWhatsappTwilio(app: FastifyInstance) {
  app.post("/whatsapp", async (request, reply) => {
    const data = twilioWhatsappSchema.parse(request.body);

    const newWaId = data.WaId + "-" + data.To;

    // const result =
    await handleIncomingWhatsappMessage(newWaId, data.To, {
      role: "user",
      content: data.Body,
    });

    // console.log(result);
  });

  app.get("/whatsapp", (request, reply) => {
    reply.send(
      "WhatsApp endpoint is working! Please send a POST request to receive a message response.",
    );
  });
}
