import { Prisma } from "../../infra/database/client.js";
export class Repository {
    async Create(data) {
        return await Prisma.produto.create({
            data: data,
        });
    }
    async Update(data, id) {
        return await Prisma.produto.update({
            where: {
                id: Number(id),
            },
            data: data,
        });
    }
    async Delete(id) {
        return await Prisma.produto.delete({
            where: {
                id: Number(id),
            },
        });
    }
    async FindAll() {
        return await Prisma.produto.findMany();
    }
    async FindAllByEstoque(estoqueId) {
        return await Prisma.produto.findMany({
            where: {
                estoqueId: estoqueId,
            },
        });
    }
    async FindById(estoqueId, id) {
        return await Prisma.produto.findUnique({
            where: {
                id: Number(id),
                estoqueId: estoqueId,
            },
        });
    }
    async FindFornecedor(cnpj, contato) {
        return await Prisma.fornecedor.findFirst({
            where: {
                OR: [{ CNPJ: cnpj }, { contato: contato }],
            },
        });
    }
    async FindFornecedorById(id) {
        return await Prisma.fornecedor.findUnique({
            where: {
                id: Number(id),
            },
        });
    }
    async FindByData(nome, categoria) {
        return await Prisma.produto.findFirst({
            where: {
                OR: [{ nome: nome }, { categoria: categoria }],
            },
        });
    }
}
