import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Prisma } from "../../shared/prisma.js";
import { decode } from "querystring";
import { SchemaCreateIA, SchemaCreateIAType } from "./schema/schemaIA.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
dotenv.config();

export const ServicesIA = {
  async CreateConfig(data: SchemaCreateIAType, companyID: number) {
    const verify = await Prisma.company.findUnique({
      where: {
        id: companyID,
      },
      select: {
        IA: true,
      },
    });

    if (!verify) {
      throw new Error("Empresa não encontrada!");
    }

    if (verify?.IA)
      throw new Error("Configuração de IA já existe para esta empresa!");
  },
};
