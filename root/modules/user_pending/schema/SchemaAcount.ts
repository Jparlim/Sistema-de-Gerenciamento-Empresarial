import z from "zod";

export const CreateAcountPending = z.object({
  nome: z.string().nonempty({ message: "O nome da empresa é obrigatório!" }),
  email: z.string().nonempty({ message: "Email inválido!" }),
  senha: z.string().nonempty({ message: "A senha é obrigatória!" }),
  CNPJ: z.string().nonempty({ message: "O CNPJ é obrigatório!" }),
  numero: z
    .string()
    .nonempty({ message: "O número de telefone é obrigatório!" }),
  token: z.string().nonempty({ message: "O token é obrigatório!" }),
});

export type CreateAcountPendingType = z.infer<typeof CreateAcountPending>;
