import { GenerateResponse } from "../../integrations/IA/gemini/gemini-provider.js";
import { Repository } from "./repository.js";
import { setInMemory } from "../../providers/memory/redis/redis-memory.js";

const repository = new Repository();

export async function handleIncomingWhatsappMessage(
  key: string,
  number: string,
  value: { role: "user" | "system"; content: string },
) {
  const history = await setInMemory(key, value);

  const numberCompany = number.replace(/\D/g, "");

  const data = await repository.getData(numberCompany);

  if (!data) {
    throw new Error("Company not found for the provided number");
  }

  //   criar uma company com o numero do twilio

  console.log({ data: data?.IA[0], history });
  //   await GenerateResponse(data!.IA[0], history);
}
