import z, { string } from "zod";

export const SchemaCreateIA = z.object({
  nomeEmpresa: z
    .string()
    .nonempty({ message: "O nome da empresa é obrigatório!" }),
  nomeIA: z.string().nonempty({ message: "O nome da IA é obrigatório!" }),
  instructions: z
    .string()
    .nonempty({ message: "As instruções para a IA são obrigatórias!" }),
  data: z.json().optional(),
});

export type SchemaCreateIAType = z.infer<typeof SchemaCreateIA>;
