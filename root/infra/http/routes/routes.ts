import { FastifyInstance } from "fastify";
import { User_Route } from "../../../modules/user/Router.js";
import { User_pending_Route } from "../../../modules/user_pending/Router.js";
import { Login_Route } from "../../../modules/login/Router.js";
import { IA_Route } from "../../../modules/IA/Router.js";
import { Cliente_Route } from "../../../modules/cliente/Router.js";
import { Visits_Route } from "../../../modules/Visits/Router.js";
import { Estoque_Route } from "../../../modules/estoque/Router.js";
import { Produto_Route } from "../../../modules/produto/Router.js";
import { Fornecedor_Route } from "../../../modules/fornecedor/Router.js";
import { Financeiro_Route } from "../../../modules/financeiro/Router.js";
import { Router_Adm } from "../../../modules/adm/Router.js";

import { sendWhatsappTwilio } from "../../../integrations/whatsapp/twilio/send-whatsapp.js";

import { middlewareValidatorAdm } from "../middleware/middlewareADM.js";

export async function Route(app: FastifyInstance) {
  app.register(Login_Route);

  app.register(User_Route);
  app.register(User_pending_Route);
  app.register(sendWhatsappTwilio);

  app.register(Router_Adm);
  app.register(IA_Route);
  app.register(Cliente_Route);
  app.register(Visits_Route);
  app.register(Estoque_Route);
  app.register(Produto_Route);
  app.register(Fornecedor_Route);
  app.register(Financeiro_Route);

  // criar rotas definidas para owner e admin
  // após isso, reformular/criar middleware de acordo com as necessidades das rotas
  // criar roles para casa empresa. ex: colaborador, proprietario, administrador(talvez)

  /*
    Ajustar o login e a proteção das rotas: verificar se o Admin está ativo e diferenciar OWNER de ADMIN.
    Enviar convite: somente OWNER; criar AdminInvite, guardar o hash do token e enviar o link com validade de 24 horas.
    Aceitar convite: validar o token, criar o Admin com senha em hash e preencher acceptedAt, na mesma transação.
    Cancelar ou reenviar: preencher revokedAt no convite anterior; no reenvio, criar outro.
    Registrar as ações: salvar quem fez o quê em AdminAuditLog. 
  */
}
