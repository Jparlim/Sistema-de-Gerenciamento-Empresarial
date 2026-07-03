import z from "zod";

export const CreateToController = z.object({
  nome: z.string().nonempty({ message: "nome do produto deve ser inserido!" }),
  categoria: z
    .string()
    .nonempty({ message: "categoria do produto deve ser inserido!" }),
  quantidade: z.int().nonnegative("deve ser inserido um número mínimo de 0!"),
  valor_unitario: z
    .float32()
    .nonnegative("deve ser inserido um número mínimo de 0!"),
  nomeFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
  contatoFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
  CNPJFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
});

export const CreateToServices = z.object({
  nome: z.string().nonempty({ message: "nome do produto deve ser inserido!" }),
  categoria: z
    .string()
    .nonempty({ message: "categoria do produto deve ser inserido!" }),
  quantidade: z.int().nonnegative("deve ser inserido um número mínimo de 0!"),
  valor_unitario: z
    .number()
    .nonnegative("deve ser inserido um número mínimo de 0!"),
  nomeFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
  contatoFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
  CNPJFornecedor: z
    .string()
    .nonempty({ message: "fornecedor do produto deve ser inserido!" }),
  estoqueId: z.int().nonnegative("deve ser inserido um número mínimo de 0!"),
});

export const CreateToRepository = z.object({
  nome: z.string().nonempty({ message: "nome do produto deve ser inserido!" }),
  categoria: z
    .string()
    .nonempty({ message: "categoria do produto deve ser inserido!" }),
  quantidade: z.int().nonnegative("deve ser inserido um número mínimo de 0!"),
  valor_unitario: z
    .number()
    .nonnegative("deve ser inserido um número mínimo de 0!"),
  fornecedorId: z
    .int()
    .nonnegative({ message: "fornecedor do produto deve ser inserido!" }),
  estoqueId: z.int().nonnegative("deve ser inserido um número mínimo de 0!"),
});

export const UpdateServices = z.object({
  nome: z.string().optional(),
  categoria: z.string().optional(),
  quantidade: z.int().optional(),
  valor_unitario: z.number().optional(),
  fornecedor: z.string().optional(),
});

export const UpdateRepository = z.object({
  nome: z.string().optional(),
  categoria: z.string().optional(),
  quantidade: z.int().optional(),
  valor_unitario: z.number().optional(),
  fornecedorId: z.int().optional(),
});

export type CreateToControllerType = z.infer<typeof CreateToController>;
export type CreateToServicesType = z.infer<typeof CreateToServices>;
export type CreateToRepositoryType = z.infer<typeof CreateToRepository>;
export type UpdateToControllerType = z.infer<typeof UpdateServices>;
export type UpdateToRepositoryType = z.infer<typeof UpdateRepository>;
