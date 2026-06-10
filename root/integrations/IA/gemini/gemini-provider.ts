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
        systemInstruction: `
        nome da empresa: ${dataCompany.nomeEmpresa}
        nome da IA: ${dataCompany.nomeIA}
        instruções: ${dataCompany.instructions}
        
        instruções padrão: Você deve extrair do histórico da conversa todas as informações do cliente
        que correspondam aos campos de dataClient.

        Se uma informação não estiver presente, retorne null.

        Nunca invente dados.
        `,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resposta: {
              type: Type.STRING,
            },
            dataClient: {
              type: Type.OBJECT,
              properties: dataRequest,
            },
          },
        },
      },
    });

    return {
      response: JSON.parse(
        response.candidates![0].content?.parts![0].text as string,
      ).resposta,
      dataClient: JSON.parse(
        response.candidates![0].content?.parts![0].text as string,
      ).dataClient,
    };
  } catch (error) {
    throw new Error("Failed to generate response", { cause: error });
  }
}
