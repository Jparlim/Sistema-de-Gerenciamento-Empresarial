import { Prisma } from "../../infra/database/client.js";
export class Repository {
    async Create(id) {
        return await Prisma.estoque.create({
            data: {
                companyId: Number(id),
            },
        });
    }
    async Update() { }
    async Delete(id) {
        return await Prisma.estoque.delete({
            where: {
                id: Number(id),
            },
        });
    }
    async FindAll() {
        return await Prisma.estoque.findMany();
    }
    async FindById(id) {
        return await Prisma.estoque.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                produtos: true,
            },
        });
    }
    async FindByCompanyId(companyId) {
        return await Prisma.estoque.findUnique({
            where: {
                companyId: Number(companyId),
            },
        });
    }
}
