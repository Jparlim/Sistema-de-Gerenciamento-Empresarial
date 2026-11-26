import { Prisma } from "../../../database/client.js";
export class repositoryMiddleware {
    async consultAdmin(id) {
        return await Prisma.admin.findUnique({
            where: { id: id },
            select: {
                id: true,
                role: true,
                ativo: true,
            },
        });
    }
}
