import z from "zod";

export const SchemaDataClient = z.object({
  nome: z.string().nonempty({ message: "nome do cliente deve ser inserido!" }),
  contato: z
    .string()
    .nonempty({ message: "número do cliente deve ser inserido!" }),
  status: z.enum(["Fechado", "Desistência", "Em Negociação"]),
  resumo: z.string(),
});

export const SchemaDataClientWithIA = z.object({
  nome: z.string().nonempty({ message: "nome do cliente deve ser inserido!" }),
  contato: z
    .string()
    .nonempty({ message: "número do cliente deve ser inserido!" }),
  status: z.enum(["Fechado", "Desistência", "Em Negociação"]),
  companyId: z.number(),
  dados: z.any().nullable(),
  // arrumar a tipagem do "dados", para fins de testes, coloquei como any
  resumo: z.string(),
});

export type SchemaDataClientType = z.infer<typeof SchemaDataClient>;
export type SchemaDataClientWithIAType = z.infer<typeof SchemaDataClientWithIA>;
