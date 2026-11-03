import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceManagement } from "./services.js";

export const companyManagement = {
  async consultAllCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultAllCompanysService();
  },
  async consultActivateCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultActivateCompanysService();
  },
  async consultDesactivateCompanysController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultDesactivateCompanysService();
  },
  async consultHowManyCompanys_pendingController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultHowManyCompanys_pendingService();
  },
  async consultCompanysActivatedController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultCompanysActivatedService();
  },
  async consultCompanysInactivatedController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    return await ServiceManagement.consultCompanysInactivatedService();
  },
};
