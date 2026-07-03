import { CreateToServicesType } from "./schema/SchemaProduto.js";
import { Repository } from "./Repository.js";

const repository = new Repository();

export const ServicesProduto = {
  async CreateServices(data: CreateToServicesType) {
    const idFornecedor = await repository.FindFornecedor(
      data.CNPJFornecedor,
      data.contatoFornecedor,
    );

    if (!idFornecedor)
      throw new Error("fornecedor não encontrado no banco de dados!");

    const newDAta = {
      nome: data.nome,
      categoria: data.categoria,
      quantidade: data.quantidade,
      valor_unitario: data.valor_unitario,
      fornecedorId: idFornecedor?.id!,
      estoqueId: data.estoqueId,
    };

    return console.log(newDAta);

    return await repository.Create(newDAta);
  },

  async UpdateServices() {},

  async DeleteServices() {},

  async FindAllServices() {
    return await repository.FindAll();
  },

  async FindByIdServices() {},
};
