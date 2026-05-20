import { gemini } from "./gemini-client.js";
import { Type } from "@google/genai";

export async function GenerateResponse(prompt: any, messages: any) {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        responseMimeType: "application/json",
        systemInstruction: prompt.systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resposta: {
              type: Type.STRING,
            },
            dataClient: {
              type: Type.OBJECT,
              properties: prompt.data,
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
