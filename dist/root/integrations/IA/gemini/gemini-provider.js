import { gemini } from "./gemini-client.js";
import { Type } from "@google/genai";
export async function GenerateResponse(dataCompany, dataRequest, messages) {
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

        Antes de tudo, pergunte e pegue o nome do cliente.
        É de extrema importância que pegue os dados desde o inicio da conversa com o cliente

        Se uma informação não estiver presente, retorne null. Nunca invente dados.
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
            response: JSON.parse(response.candidates[0].content?.parts[0].text).resposta,
            dataClient: JSON.parse(response.candidates[0].content?.parts[0].text).dataClient,
        };
    }
    catch (error) {
        throw new Error("Failed to generate response", { cause: error });
    }
}
