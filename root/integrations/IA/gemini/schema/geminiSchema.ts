import z from "zod";

export const geminiSchema = z.object({
  nomeEmpresa: z.string(),
  nomeIA: z.string(),
  instructions: z.string(),
  data: z.record(z.string(), z.string()),
});

export type GeminiType = z.infer<typeof geminiSchema>;
