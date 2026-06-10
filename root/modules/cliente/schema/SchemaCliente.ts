import z from "zod";

export const SchemaDataClient = z.object({
  nome: z.string().nonempty({ message: "nome do cliente deve ser inserido!" }),
  contato: z
    .string()
    .nonempty({ message: "número do cliente deve ser inserido!" }),
  status: z.enum(["Fechado", "Desistência", "Em Negociação"]),
  companyId: z.number(),
});

export type SchemaDataClientType = z.infer<typeof SchemaDataClient>;
