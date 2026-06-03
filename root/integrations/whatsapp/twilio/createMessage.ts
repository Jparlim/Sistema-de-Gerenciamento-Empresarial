import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const client = twilio(accountSid, authToken);

export async function createMessage(content: string, to: string) {
  return await client.messages.create({
    body: content,
    from: `whatsapp:${whatsappNumber}`,
    to: `${to}`,
  });
}
