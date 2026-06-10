import { FastifyRequest } from "fastify";
import { SchemaDataClientType, SchemaDataClient } from "./schema/SchemaCliente.js";

export const ControllerClient = {
    async CreateController(request:FastifyRequest, reply: FastifyRequest) {
        const data = SchemaDataClient.parse(request.body);


    },

    async DeleteController() {

    },
    async FindByIdController() {

    },
    async FindAllController() {
        
    }
}