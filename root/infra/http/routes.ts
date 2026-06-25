import { FastifyInstance } from "fastify";
import { User_Route } from "../../modules/user/Router.js";
import { User_pending_Route } from "../../modules/user_pending/Router.js";
import { Login_Route } from "../../modules/login/Router.js";
import { IA_Route } from "../../modules/IA/Router.js";
import { Cliente_Route } from "../../modules/cliente/Router.js";
import { Route_Visits } from "../../modules/Visits/Router.js";

import { sendWhatsappTwilio } from "../../integrations/whatsapp/twilio/send-whatsapp.js";

export async function Route(app: FastifyInstance) {
  app.register(User_Route);
  app.register(User_pending_Route);
  app.register(Login_Route);
  app.register(IA_Route);
  app.register(Cliente_Route);
  app.register(Route_Visits);

  app.register(sendWhatsappTwilio);
}
