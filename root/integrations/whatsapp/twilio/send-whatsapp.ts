import type { FastifyInstance } from "fastify";
import { twilioWhatsappSchema } from "./schema/send-whatsapp-schema.js";
import { handleIncomingWhatsappMessage } from "../../../workflows/handle-incoming-whatsapp-message/service.js";
import { createMessage } from "./createMessage.js";

function formatPhone(phone: string): string {
  const number = phone.replace(/^(whatsapp:)?\+55/, "");

  if (number.length === 10) {
    return `${number.slice(0, 2)}9${number.slice(2)}`;
  }

  return number;
}

export async function sendWhatsappTwilio(app: FastifyInstance) {
  app.post("/whatsapp", async (request, reply) => {
    const data = twilioWhatsappSchema.parse(request.body);

    const newWaId = data.WaId + "-" + data.To;

    const clientNumber = formatPhone(data.From);

    try {
      const result = await handleIncomingWhatsappMessage(
        newWaId,
        clientNumber,
        data.To,
        {
          role: "user",
          content: data.Body,
        },
      );

      return await createMessage(result.response, data.From);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  });

  app.get("/whatsapp", (request, reply) => {
    reply.send(
      "WhatsApp endpoint is working! Please send a POST request to receive a message response.",
    );
  });
}
