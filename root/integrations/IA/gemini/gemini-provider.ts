import { gemini } from "./gemini-client.js";
import { Type } from "@google/genai";
import { GeminiType, GeminiTypeData } from "./schema/geminiSchema.js";

export async function GenerateResponse(
  dataCompany: GeminiType,
  dataRequest: GeminiTypeData,
  messages: { role: "user" | "model"; parts: [{ text: string }] }[],
) {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "nome da empresa: " +
          dataCompany.nomeEmpresa +
          "seu nome é: " +
          dataCompany.nomeIA +
          "instruções: " +
          dataCompany.instructions,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resposta: {
              type: Type.STRING,
            },
            dataClient: {
              type: Type.OBJECT,
              properties: dataRequest.data,
            },
          },
        },
      },
    });

    console.log({
      response: JSON.parse(response.text as string),
    });

    // return {
    //   response: response,
    //   dataClient: JSON.parse(response.text as string)[0].dataClient,
    // };
  } catch (error) {
    throw new Error("Failed to generate response", { cause: error });
  }
}
