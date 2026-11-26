export const htmlTemplate = `
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verificação de segurança</title>
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
      style="background-color: #f3f4f6; padding: 32px 12px"
    >
      <tr>
        <td align="center">
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
              <td style="padding: 32px 28px 24px">
                <h2
                  style="
                    margin: 0 0 16px;
                    font-size: 22px;
                    line-height: 1.4;
                    color: #111827;
                  "
                >
                  Confirme sua identidade
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
                  Para continuar, utilize o código abaixo para concluir a
                  verificação de segurança da sua conta.
                </p>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        padding: 24px 12px;
                        background-color: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 12px;
                          color: #6b7280;
                          font-size: 12px;
                          text-transform: uppercase;
                          letter-spacing: 1.5px;
                        "
                      >
                        Seu código de verificação
                      </p>

                      <p
                        style="
                          margin: 0;
                          color: #111827;
                          font-size: 34px;
                          font-weight: 700;
                          letter-spacing: 8px;
                        "
                      >
                        {{code}}
                      </p>

                      <p
                        style="
                          margin: 14px 0 0;
                          color: #6b7280;
                          font-size: 13px;
                        "
                      >
                        Válido por 5 minutos
                      </p>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 24px 0 8px;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #4b5563;
                  "
                >
                  Digite esse código na tela de verificação para continuar.
                </p>

                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="margin-top: 24px"
                >
                  <tr>
                    <td
                      style="
                        padding: 16px;
                        background-color: #fff7ed;
                        border-left: 3px solid #f59e0b;
                        border-radius: 4px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 14px;
                          font-weight: 700;
                          color: #92400e;
                        "
                      >
                        Aviso de segurança
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 13px;
                          line-height: 1.7;
                          color: #92400e;
                        "
                      >
                        Nunca compartilhe esse código com ninguém. Nossa equipe
                        não solicitará seu código de verificação.
                      </p>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 24px 0 0;
                    font-size: 13px;
                    line-height: 1.7;
                    color: #6b7280;
                  "
                >
                  Se você não solicitou essa verificação, ignore este e-mail.
                  Nenhuma ação é necessária.
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
