import { AppError } from "../../../infra/error/AppError.js";
import { sendEmail } from "../../../integrations/aws/ses/service/index.js";
import { htmlTemplate } from "./html.js";

export async function sendForgotPasswordEmail(to: string, url: string) {
  const subject = "Verificação de segurança — Seu código de acesso";
  const text = ``;
  const html = htmlTemplate.replace("{{resetPasswordUrl}}", url);

  try {
    return await sendEmail({ to, subject, text, html });
  } catch (error) {
    throw new AppError(500, "Erro ao enviar email de verificação:");
  }
}
