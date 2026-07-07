import { Repository } from "./repository.js";
import { setInMemory } from "../../providers/memory/redis/redis-memory.js";
import { GenerateResponse } from "../../integrations/IA/gemini/gemini-provider.js";
import { GeminiType } from "../../integrations/IA/gemini/schema/geminiSchema.js";
import { ServicesClient } from "../../modules/cliente/Services.js";

import { Type } from "@google/genai";

type GeminiMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

type Message = {
  role: "user" | "model";
  content: string;
};

const repository = new Repository();

export async function handleIncomingWhatsappMessage(
  key: string,
  clientNumber: string,
  companyNumber: string,
  value: { role: "user" | "model"; content: string },
) {
  const history: GeminiMessage[] = await setInMemory(key, value).then((res) => {
    return res
      .map((item) => JSON.parse(item) as Message)
      .map((item) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.content }],
      }));
  });

  const companyNumberfixed = companyNumber.replace(/\D/g, "");

  const dataCompany = await repository
    .getData(companyNumberfixed)
    .then((res) => {
      return res?.IA as GeminiType;
    });

  if (!dataCompany) {
    throw new Error("IA of Company not found for the provided number");
  } else if (dataCompany === undefined) {
    throw new Error("Company data is undefined");
    // criar uma IA de emergência para responder que a empresa não tem IA configurada
  }

  const TypeMap = {
    String: Type.STRING,
    Number: Type.NUMBER,
    Boolean: Type.BOOLEAN,
  } as const;

  const dynamicProperties = {
    ...Object.fromEntries(
      Object.entries(dataCompany.data).map(([key, value]) => [
        key,
        {
          type: TypeMap[value],
        },
      ]),
    ),
    nome: { type: TypeMap["String"] },
    resumo: { type: TypeMap["String"] },
  };

  const result = await GenerateResponse(
    dataCompany,
    dynamicProperties,
    history,
  );

  await setInMemory(key, { role: "model", content: result.response });

  // verificar se todos os campos do dataClient são diferentes de "null"

  const verify = Object.entries(result.dataClient).every(
    ([, value]) => value !== "null",
  );

  if (verify === true) {
    await ServicesClient.CreateServicesWithAI({
      nome: result.dataClient.nome || "não identificado",
      contato: clientNumber || "não identificado",
      status: "Em Negociação",
      companyId: dataCompany.companyId,
      dados: result.dataClient || null,
      resumo: result.dataClient.resumo || "não identificado",
    });
  }

  // verificar se está correto

  return result;
}
