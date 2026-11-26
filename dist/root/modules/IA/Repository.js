import { Prisma } from "../../infra/database/client.js";
export class RepositoryIA {
    async create(dados, companyID) {
        return await Prisma.iA.create({
            data: {
                company: {
                    connect: { id: companyID },
                },
                instructions: dados.instructions,
                nomeEmpresa: dados.nomeEmpresa,
                nomeIA: dados.nomeIA,
                data: dados.data ?? undefined,
            },
        });
    }
    async delete(id, companyId) {
        return await Prisma.iA.deleteMany({
            where: {
                id,
                companyId,
            },
        });
    }
    async findAll() {
        return await Prisma.iA.findMany();
    }
    async findByCompany(companyId) {
        return await Prisma.iA.findUnique({
            where: { companyId },
        });
    }
    async update(id, data) {
        return await Prisma.iA.update({
            where: { companyId: id },
            data,
        });
    }
}
