import z from "zod";

export const CreateController = z.object({
  nome: z.string().nonempty("nome é obrigatório!"),
  contato: z.string().nonempty("contato é obrigatório!"),
  CNPJ: z.string().nonempty("CNPJ é obrigatório!"),
});

export const UpdateController = z.object({
  nome: z.string().optional(),
  contato: z.string().optional(),
  CNPJ: z.string().optional(),
});

export type CreateControllerType = z.infer<typeof CreateController>;
export type updateControllerType = z.infer<typeof UpdateController>;
