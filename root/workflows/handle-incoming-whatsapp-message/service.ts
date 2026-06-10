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
    throw new Error("Company not found for the provided number");
  } else if (dataCompany === undefined) {
    throw new Error("Company data is undefined");
    // criar uma IA de emergência para responder que a empresa não tem IA configurada
  }

  const TypeMap = {
    String: Type.STRING,
    Number: Type.NUMBER,
    Boolean: Type.BOOLEAN,
  } as const;

  const dynamicProperties = Object.fromEntries(
    Object.entries(dataCompany.data).map(([key, value]) => [
      key,
      {
        type: TypeMap[value],
      },
    ]),
  );

  // return console.log(dynamicProperties);

  const result = await GenerateResponse(
    dataCompany,
    dynamicProperties,
    history,
  );

  await setInMemory(key, { role: "model", content: result.response });

  await ServicesClient.CreateServicesWithAI({
    data: result.dataClient,
    id: dataCompany.companyId,
  });
  // precisa do numero e nome do cliente. deixar estes dados como padrão!

  return result;
}
