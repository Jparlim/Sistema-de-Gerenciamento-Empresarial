import z, { string } from "zod";
import { Type } from "@google/genai";

const FieldTypeSchema = z.enum(["String", "Number", "Boolean"]);

export const geminiSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  nomeEmpresa: z.string(),
  nomeIA: z.string(),
  instructions: z.string(),
  data: z.record(z.string(), FieldTypeSchema),
});

export const teste = z.record(
  z.string(),
  z.object({
    type: z.enum([Type.STRING, Type.NUMBER, Type.BOOLEAN]),
  }),
);

export type GeminiTypeData = z.infer<typeof teste>;
export type GeminiType = z.infer<typeof geminiSchema>;
