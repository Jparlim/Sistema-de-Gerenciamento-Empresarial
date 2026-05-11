import { FastifyInstance } from "fastify";
import { User_Route } from "../../modules/user/Router.js";

export async function Route(app: FastifyInstance) {
  app.register(User_Route);
}
