import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Prisma } from "../../infra/database/client.js";
import { SchemaCreateIAType } from "./schema/schemaIA.js";
import { RepositoryIA } from "./Repository.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
dotenv.config();

const repository = new RepositoryIA();

export const ServicesIA = {
  async CreateServices(data: SchemaCreateIAType, companyID: number) {
    const verify = await Prisma.company.findUnique({
      where: {
        id: Number(companyID),
      },
      select: {
        IA: true,
      },
    });

    if (!verify) {
      throw new Error("Empresa não encontrada!");
    }

    if (verify.IA) {
      console.log(verify.IA);
      throw new Error("Configuração de IA já existe para esta empresa!");
    }

    return await repository.create(data, companyID);
  },

  async DeleteServices(id: number) {
    const verify = await Prisma.iA.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!verify) {
      throw new Error("Configuração de IA não encontrada!");
    }

    return await repository.delete(id);
  },

  async FindAllServices() {
    return await repository.findAll();
  },
};
