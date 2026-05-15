import z from "zod";

export const CreateAcountPending = z.object({
  nomeEmpresa: z
    .string()
    .nonempty({ message: "O nome da empresa é obrigatório!" }),
  email: z.string().nonempty({ message: "Email inválido!" }),
  senha: z.string().nonempty({ message: "A senha é obrigatória!" }),
  CNPJ: z.string().nonempty({ message: "O CNPJ é obrigatório!" }),
  telefone: z
    .string()
    .nonempty({ message: "O número de telefone é obrigatório!" }),
  token: z.string().nonempty({ message: "token é necessário!" }),
  token_expires: z.date(),
});

export const CreateAcountWithDataOnBody = z.object({
  nomeEmpresa: z
    .string()
    .nonempty({ message: "O nome da empresa é obrigatório!" }),
  email: z.string().nonempty({ message: "Email inválido!" }),
  senha: z.string().nonempty({ message: "A senha é obrigatória!" }),
  CNPJ: z.string().nonempty({ message: "O CNPJ é obrigatório!" }),
  telefone: z
    .string()
    .nonempty({ message: "O número de telefone é obrigatório!" }),
});

export type CreateAcountPendingType = z.infer<typeof CreateAcountPending>;
export type CreateAcountPendingOfBodyType = z.infer<
  typeof CreateAcountWithDataOnBody
>;
