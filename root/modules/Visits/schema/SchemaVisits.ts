import { z } from "zod";

export const SchemaCreateVisits = z.object({
  contato: z.string().nonempty("O campo contato é obrigatório!"),
  nome: z.string().nonempty("O campo nome é obrigatório"),
  data: z.string().nonempty("O campo data é obrigatório!"),
  endereco: z.string().nonempty("O campo endereço é obrigatório!"),
  hora: z.string().nonempty("O campo hora é obrigatório!"),
  observacao: z.string().nonempty("O campo observação é obrigatório!"),
  responsavel: z.string().nonempty("O campo responsável é obrigatório!"),
  status: z.enum(["cancelado", "pendente", "concluido"]),
});

export const SchemaUpdateVisits = z.object({
  contato: z.string().optional(),
  data: z.string().optional(),
  endereco: z.string().optional(),
  hora: z.string().optional(),
  observacao: z.string().optional(),
  responsavel: z.string().optional(),
  status: z.enum(["cancelado", "pendente", "concluido"]),
});

export type SchemaCreateVisitsType = z.infer<typeof SchemaCreateVisits>;
export type SchemaUpdateVisitsType = z.infer<typeof SchemaUpdateVisits>;
