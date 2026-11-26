import { Prisma } from "../../infra/database/client.js";
export class Repository {
    async Create(data, id) {
        return await Prisma.visits.create({
            data: { ...data, clientId: id },
        });
    }
    async Update(id, data) {
        await Prisma.visits.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
    async Delete(id, companyId) {
        const { count } = await Prisma.visits.deleteMany({
            where: {
                id: Number(id),
                client: { companyId },
            },
        });
        return count > 0;
    }
    async FindAll(companyId, year, month) {
        const monthPrefix = year && month
            ? `${year}-${String(month).padStart(2, "0")}`
            : undefined;
        return await Prisma.visits.findMany({
            where: {
                client: { companyId },
                ...(monthPrefix ? { data: { startsWith: monthPrefix } } : {}),
            },
            orderBy: [{ data: "asc" }, { hora: "asc" }],
        });
    }
    async FindById(id) {
        return await Prisma.visits.findUnique({
            where: {
                id: Number(id),
            },
        });
    }
    async FindByNumber(contato) {
        return await Prisma.cliente.findUnique({
            where: {
                contato: contato,
            },
        });
    }
}
