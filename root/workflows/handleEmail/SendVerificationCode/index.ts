import { AppError } from "../../../infra/error/AppError.js";
import { sendEmail } from "../../../integrations/aws/ses/service/index.js";
import { htmlTemplate } from "./htmlTemplate.js";

export async function sendVerificationCodeEmail(to: string, code: string) {
  const subject = "Verificação de segurança — Seu código de acesso";
  const text = `Olá!

Recebemos uma solicitação de verificação de segurança para acessar sua conta.

Seu código de verificação é: ${{ code }}

Digite esse código na tela de verificação para continuar. Ele é válido por 5 minutos.

Por segurança, não compartilhe esse código com ninguém. Nossa equipe nunca solicitará seu código de verificação por telefone ou mensagem.

Se você não solicitou essa verificação, ignore este e-mail. Sua conta continuará protegida.

Atenciosamente,
Equipe Quantyum`;
  const html = htmlTemplate.replace("{{ code }}", code);

  //   algo simples por enquanto

  try {
    return await sendEmail({ to, subject, text, html });
  } catch (error) {
    throw new AppError(500, "Erro ao enviar email de verificação:");
  }
}
