export const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redefinição de senha</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="background-color: #f3f4f6"
    >
      <tr>
        <td align="center" style="padding: 32px 12px">
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              max-width: 520px;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <tr>
              <td
                align="center"
                style="padding: 32px 24px 24px; background-color: #111827"
              >
                <h1
                  style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 25px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                  "
                >
                  Quantyum
                </h1>

                <p style="margin: 8px 0 0; color: #d1d5db; font-size: 13px">
                  Segurança da sua conta
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 32px 28px">
                <h2
                  style="
                    margin: 0 0 16px;
                    font-size: 22px;
                    line-height: 1.4;
                    color: #111827;
                  "
                >
                  Redefina sua senha
                </h2>

                <p
                  style="
                    margin: 0 0 16px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                  "
                >
                  Olá!
                </p>

                <p
                  style="
                    margin: 0 0 24px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                  "
                >
                  Recebemos uma solicitação para redefinir a senha da sua
                  conta. Clique no botão abaixo para criar uma nova senha.
                </p>

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  align="center"
                  style="margin: 0 auto"
                >
                  <tr>
                    <td
                      align="center"
                      bgcolor="#111827"
                      style="border-radius: 8px"
                    >
                      <a
                        href="{{resetPasswordUrl}}"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 16px 32px;
                          border: 1px solid #111827;
                          border-radius: 8px;
                          background-color: #111827;
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: 700;
                          line-height: 1.4;
                          text-decoration: none;
                          text-align: center;
                        "
                      >
                        Redefinir minha senha
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 24px 0 8px;
                    font-size: 13px;
                    line-height: 1.7;
                    color: #6b7280;
                  "
                >
                  Se o botão não funcionar, copie e cole o link abaixo no
                  seu navegador:
                </p>

                <p
                  style="
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.7;
                    word-break: break-all;
                    overflow-wrap: anywhere;
                  "
                >
                  <a
                    href="{{resetPasswordUrl}}"
                    target="_blank"
                    style="color: #2563eb; text-decoration: underline"
                  >
                    {{resetPasswordUrl}}
                  </a>
                </p>

                <p
                  style="
                    margin: 24px 0 0;
                    font-size: 13px;
                    line-height: 1.7;
                    color: #6b7280;
                  "
                >
                  Se você não solicitou a redefinição de senha, ignore este
                  e-mail. Sua senha permanecerá a mesma.
                </p>
              </td>
            </tr>

            <tr>
              <td
                align="center"
                style="
                  padding: 20px 24px;
                  background-color: #f9fafb;
                  border-top: 1px solid #e5e7eb;
                "
              >
                <p style="margin: 0 0 6px; font-size: 13px; color: #6b7280">
                  Este é um e-mail automático. Por favor, não responda.
                </p>

                <p style="margin: 0; font-size: 12px; color: #9ca3af">
                  © Quantyum — Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;