import { gemini } from "./gemini-client.js";
import { Type } from "@google/genai";

import { GeminiType } from "./schema/geminiSchema.js";

export async function GenerateResponse(
  data: GeminiType,
  messages: { role: "user" | "system"; content: string }[],
) {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        responseMimeType: "application/json",
        systemInstruction: ,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resposta: {
              type: Type.STRING,
            },
            dataClient: {
              type: Type.OBJECT,
              properties: data.data,
            },
          },
        },
      },
    });

    return {
      response: response,
      dataClient: JSON.parse(response.text as string)[0].dataClient,
    };
  } catch (error) {
    throw new Error("Failed to generate response");
  }
}
