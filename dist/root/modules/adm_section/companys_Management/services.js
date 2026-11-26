import { AppError } from "../../../infra/error/AppError.js";
import { Prisma } from "../../../infra/database/client.js";
import { nextDate, saoPauloDayStart } from "../historic_management/query.js";
import { companyQuerySchema, escapeContains, paginate, writeAudit, } from "../shared.js";
const companyProjection = {
    id: true,
    nome: true,
    email: true,
    CNPJ: true,
    telefone: true,
    status: true,
    statusReason: true,
    createdAt: true,
    lastLoginAt: true,
};
function saoPauloMonthStart(date) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
    })
        .formatToParts(date)
        .map((part) => [part.type, part.value]));
    return saoPauloDayStart(`${parts.year}-${parts.month}-01`);
}
function monthBefore(year, month, offset) {
    const date = new Date(Date.UTC(year, month - 1 - offset, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
export const ServiceManagement = {
    async consultCompanysService() {
        const now = new Date();
        const currentMonthStart = saoPauloMonthStart(now);
        const [totalCompanies, activeCompanies, inactiveCompanies, newCompaniesThisMonth, recentCompanies,] = await Promise.all([
            Prisma.company.count(),
            Prisma.company.count({ where: { status: true } }),
            Prisma.company.count({ where: { status: false } }),
            Prisma.company.count({
                where: { createdAt: { gte: currentMonthStart, lte: now } },
            }),
            Prisma.company.findMany({
                select: companyProjection,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                take: 5,
            }),
        ]);
        const pendingCompanies = await Prisma.company_Pending
            .count()
            .catch(() => null);
        const monthParts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "numeric",
        })
            .formatToParts(now)
            .map((part) => [part.type, part.value]));
        const months = Array.from({ length: 12 }, (_, index) => monthBefore(Number(monthParts.year), Number(monthParts.month), 11 - index));
        const growth = await Promise.all(months.map(async (month) => {
            const start = saoPauloDayStart(`${month}-01`);
            const nextMonthDate = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1));
            const nextMonth = `${nextMonthDate.getUTCFullYear()}-${String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0")}`;
            return {
                month,
                count: await Prisma.company.count({
                    where: {
                        createdAt: {
                            gte: start,
                            lt: saoPauloDayStart(`${nextMonth}-01`),
                        },
                    },
                }),
            };
        }));
        return {
            totalCompanies,
            activeCompanies,
            inactiveCompanies,
            newCompaniesThisMonth,
            pendingCompanies,
            growth,
            recentCompanies,
        };
    },
    async consultAdminMeService(id) {
        return Prisma.admin.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                ativo: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });
    },
    async consultCompanysFilteredService(rawQuery) {
        const query = companyQuerySchema.parse(rawQuery);
        const normalized = query.search?.replace(/[.\-/\s]/g, "");
        const where = {
            ...(query.status ? { status: query.status === "ACTIVE" } : {}),
            ...(query.from || query.to
                ? {
                    createdAt: {
                        ...(query.from ? { gte: saoPauloDayStart(query.from) } : {}),
                        ...(query.to ? { lt: saoPauloDayStart(nextDate(query.to)) } : {}),
                    },
                }
                : {}),
            ...(query.search
                ? {
                    OR: [
                        { nome: escapeContains(query.search) },
                        { email: escapeContains(query.search) },
                        { CNPJ: { contains: normalized, mode: "insensitive" } },
                    ],
                }
                : {}),
        };
        const [total, items] = await Promise.all([
            Prisma.company.count({ where }),
            Prisma.company.findMany({
                where,
                select: companyProjection,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                skip: (query.page - 1) * query.pageSize,
                take: query.pageSize,
            }),
        ]);
        return paginate(items, total, query.page, query.pageSize);
    },
    async consultCompanyByIdService(id) {
        const company = await Prisma.company.findUnique({
            where: { id },
            select: {
                ...companyProjection,
                saldo: true,
                IA: { select: { nomeEmpresa: true, nomeIA: true, instructions: true } },
            },
        });
        if (!company)
            throw new AppError(404, "Empresa não encontrada.");
        return company;
    },
    async setCompanyStatus(id, status, reason, actorId) {
        if (!status && !reason?.trim())
            throw new AppError(400, "Informe a justificativa da desativação.");
        await Prisma.$transaction(async (tx) => {
            const current = await tx.company.findUnique({
                where: { id },
                select: { id: true, status: true, statusReason: true },
            });
            if (!current)
                throw new AppError(404, "Empresa não encontrada.");
            if (current.status === status &&
                (!status || current.statusReason === reason?.trim()))
                return;
            await tx.company.update({
                where: { id },
                data: { status, statusReason: status ? null : reason.trim() },
            });
            await writeAudit(tx, {
                actorId,
                action: status ? "COMPANY_REACTIVATED" : "COMPANY_DEACTIVATED",
                targetType: "Company",
                targetId: id,
                companyId: id,
                details: {
                    previousStatus: current.status,
                    newStatus: status,
                    ...(status ? {} : { statusReason: reason.trim() }),
                },
            });
        });
    },
};
