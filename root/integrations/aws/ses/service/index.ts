import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../../ses/client/index.js";
import "dotenv/config";

interface SendEmailDTO {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailDTO) {
  const from = process.env.AWS_SES_FROM_MAIL;

  if (!from) {
    throw new Error("AWS_SES_FROM_EMAIL não configurado");
  }

  const command = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
      Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },

      Body: {
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  });

  return await sesClient.send(command);
}
