import { Prisma } from "../../../infra/database/client.js";
import { AppError } from "../../../infra/error/AppError.js";
import { listQuerySchema, escapeContains, paginate, writeAudit, } from "../shared.js";
const adminProjection = {
    id: true,
    nome: true,
    email: true,
    role: true,
    ativo: true,
    createdAt: true,
    lastLoginAt: true,
};
export const serviceManagement = {
    async consultAllAdminsService(rawQuery) {
        const query = listQuerySchema.parse(rawQuery);
        const where = query.search
            ? {
                OR: [
                    { nome: escapeContains(query.search) },
                    { email: escapeContains(query.search) },
                ],
            }
            : {};
        const [total, items, activeOwnerCount] = await Promise.all([
            Prisma.admin.count({ where }),
            Prisma.admin.findMany({
                where,
                select: adminProjection,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                skip: (query.page - 1) * query.pageSize,
                take: query.pageSize,
            }),
            Prisma.admin.count({ where: { role: "OWNER", ativo: true } }),
        ]);
        return {
            ...paginate(items, total, query.page, query.pageSize),
            activeOwnerCount,
        };
    },
    async changeAdminStatus(id, ativo, actorId) {
        try {
            await Prisma.$transaction(async (tx) => {
                const current = await tx.admin.findUnique({
                    where: { id },
                    select: { id: true, ativo: true, role: true },
                });
                if (!current)
                    throw new AppError(404, "Administrador não encontrado.");
                if (current.ativo === ativo)
                    return;
                if (!ativo && current.role === "OWNER") {
                    const activeOwners = await tx.admin.count({
                        where: { role: "OWNER", ativo: true },
                    });
                    if (activeOwners <= 1)
                        throw new AppError(409, "O último OWNER ativo não pode ser desativado.");
                }
                await tx.admin.update({ where: { id }, data: { ativo } });
                await writeAudit(tx, {
                    actorId,
                    action: ativo ? "ADMIN_REACTIVATED" : "ADMIN_DEACTIVATED",
                    targetType: "Admin",
                    targetId: id,
                    details: { previousStatus: current.ativo, newStatus: ativo },
                });
            }, { isolationLevel: "Serializable" });
        }
        catch (error) {
            if (error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "P2034")
                throw new AppError(409, "O estado dos administradores mudou. Atualize a lista e tente novamente.");
            throw error;
        }
    },
};
