import z from "zod";

export const CreateMovimentacao = z.object({
  descricao: z
    .string()
    .nonempty({ message: "descrição da movimentação deve ser inserida!" }),
  valor: z.number().positive({ message: "valor deve ser maior que 0!" }),
  tipo: z.enum(["ENTRADA", "SAIDA"], {
    message: "tipo deve ser ENTRADA ou SAIDA!",
  }),
});

export type CreateMovimentacaoType = z.infer<typeof CreateMovimentacao>;
