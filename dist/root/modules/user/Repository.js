import { Prisma } from "../../infra/database/client.js";
export class RepositoryCount {
    async create(data) {
        return await Prisma.company.create({
            data: data,
        });
    }
    async update(id, data) {
        return await Prisma.company.update({ where: { id: Number(id) }, data });
    }
    async delete(id) {
        return await Prisma.company.delete({ where: { id: Number(id) } });
    }
    async findAll() {
        return await Prisma.company.findMany({
            include: {
                IA: true,
                estoque: true,
            },
        });
    }
    async findById(id) {
        return await Prisma.company.findUnique({
            where: { id: Number(id) },
            include: { IA: true, estoque: true },
        });
    }
    async findByIdPending(id) {
        return await Prisma.company_Pending.findUnique({
            where: { id: Number(id) },
        });
    }
}
