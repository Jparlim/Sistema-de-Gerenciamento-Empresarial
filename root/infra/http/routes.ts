import { FastifyInstance } from "fastify";
import { User_Route } from "../../modules/user/Router.js";
import { User_pending_Route } from "../../modules/user_pending/Router.js";
import { Login_Route } from "../../modules/login/Router.js";
import { IA_Route } from "../../modules/IA/Router.js";

import { CorsPlugin } from "./plugins/cors.js";
import { TokensPlugin } from "./plugins/tokens.js";
import { CookiePlugin } from "./plugins/cookies.js";

export async function Route(app: FastifyInstance) {
  app.register(User_Route);
  app.register(User_pending_Route);
  app.register(Login_Route);
  app.register(IA_Route);

  app.register(CorsPlugin);
  app.register(TokensPlugin);
  app.register(CookiePlugin);
}
