import { AppError } from "../../../infra/error/AppError.js";
import { sendEmail } from "../../../integrations/aws/ses/service/index.js";
import { htmlTemplate } from "./html.js";
export async function sendInviteToNewAdmin(to, url) {
    const subject = "Criação de senha";
    const text = ``;
    const html = htmlTemplate.replace("{{inviteUrl}}", url);
    try {
        return await sendEmail({ to, subject, text, html });
    }
    catch (error) {
        throw new AppError(500, "Erro ao enviar email de recuperação de senha:");
    }
}
