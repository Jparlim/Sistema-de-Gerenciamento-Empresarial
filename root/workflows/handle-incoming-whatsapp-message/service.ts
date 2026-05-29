import { Repository } from "./repository.js";
import { setInMemory } from "../../providers/memory/redis/redis-memory.js";
import { GenerateResponse } from "../../integrations/IA/gemini/gemini-provider.js";
import { GeminiType } from "../../integrations/IA/gemini/schema/geminiSchema.js";

const repository = new Repository();

export async function handleIncomingWhatsappMessage(
  key: string,
  companyNumber: string,
  value: { role: "user" | "system"; content: string },
) {
  const history = await setInMemory(key, value);

  const companyNumberfixed = companyNumber.replace(/\D/g, "");

  const data = await repository.getData(companyNumberfixed);

  if (!data) {
    throw new Error("Company not found for the provided number");
  } else if (data === undefined) {
    throw new Error("Company data is undefined");
    // criar uma IA de emergência para responder que a empresa não tem IA configurada
  }

  console.log({ data: data.IA[0], history });

  // o historico esta vindo como uma lista com varias strings, acho que precisa tipar para json, tem que ver

  // const result = await GenerateResponse(data.IA[0] as GeminiType, history);
}
