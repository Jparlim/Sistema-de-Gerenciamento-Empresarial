import { FastifyInstance } from "fastify";
import { ControllerClient } from "./Controller.js"

export function Cliente_Route(app: FastifyInstance) {
    app.post("/client", ControllerClient.CreateController)
}