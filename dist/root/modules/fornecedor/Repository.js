import { Prisma } from "../../infra/database/client.js";
export class Repository {
    async Create(data) {
        return await Prisma.fornecedor.create({
            data: data,
        });
    }
    async Update(data, id) {
        return await Prisma.fornecedor.update({
            where: {
                id: Number(id),
            },
            data,
        });
    }
    async Delete(companyId, fornecedorId) {
        return await Prisma.gerenciamentoFornecedor.delete({
            where: {
                companyId_fornecedorId: {
                    companyId: companyId,
                    fornecedorId: fornecedorId,
                },
            },
        });
    }
    async FindAll() {
        return await Prisma.fornecedor.findMany();
    }
    async FindById(id) {
        return await Prisma.fornecedor.findUnique({
            where: {
                id: Number(id),
            },
        });
    }
    async FindByData(data) {
        return await Prisma.fornecedor.findFirst({
            where: {
                OR: [
                    { CNPJ: data.CNPJ },
                    { contato: data.contato },
                    { nome: data.nome },
                ],
            },
        });
    }
}
