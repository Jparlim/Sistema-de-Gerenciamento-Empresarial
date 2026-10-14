import { sendEmail } from "../../integrations/aws/ses/service/index.js";

async function main() {
  try {
    const response = await sendEmail({
      to: "gusjao0500@gmail.com",
      subject: "Teste de integração AWS SES",
      text: "Se você recebeu este e-mail, o envio funcionou!",
      html: "<h1>Integração AWS SES funcionando!</h1>",
    });

    console.log("Solicitação aceita pela AWS!");
    console.log("Message ID:", response.MessageId);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    process.exitCode = 1;
  }
}

await main();
