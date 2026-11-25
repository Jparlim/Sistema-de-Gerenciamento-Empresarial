import type { FastifyRequest } from "fastify";
import { z } from "zod";
import type { Prisma as PrismaNamespace } from "@prisma/client";

const pageNumber = (fallback: number, max: number) =>
  z.preprocess(
    (value) =>
      value === undefined
        ? fallback
        : typeof value === "string" && /^\d+$/.test(value)
          ? Number(value)
          : value,
    z.number().int().min(1).max(max),
  );

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Data inválida");

export const listQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => value || undefined),
  page: pageNumber(1, 1_000_000),
  pageSize: pageNumber(10, 100),
});

export const companyQuerySchema = listQuerySchema
  .extend({
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
  })
  .superRefine((query, context) => {
    if (query.from && query.to && query.from > query.to)
      context.addIssue({
        code: "custom",
        path: ["from"],
        message: "A data inicial deve ser anterior ou igual à data final",
      });
  });

export const inviteQuerySchema = listQuerySchema.extend({
  status: z.enum(["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"]).optional(),
});

export function sessionAdminId(request: FastifyRequest): number {
  const token = request.cookies.refreshToken;
  if (!token) throw new Error("Sessão administrativa ausente.");
  const payload = request.server.jwt.verify(token) as { id?: unknown };
  if (
    typeof payload.id !== "number" ||
    !Number.isSafeInteger(payload.id) ||
    payload.id < 1
  )
    throw new Error("Sessão administrativa inválida.");
  return payload.id;
}

export async function writeAudit(
  tx: PrismaNamespace.TransactionClient,
  data: {
    actorId: number;
    action:
      | "ADMIN_INVITED"
      | "ADMIN_INVITE_REVOKED"
      | "ADMIN_INVITE_ACCEPTED"
      | "ADMIN_DEACTIVATED"
      | "ADMIN_REACTIVATED"
      | "COMPANY_DEACTIVATED"
      | "COMPANY_REACTIVATED";
    targetType: string;
    targetId: number;
    companyId?: number;
    details?: PrismaNamespace.InputJsonObject;
  },
) {
  await tx.adminAuditLog.create({
    data: {
      ...data,
      companyId: data.companyId ?? undefined,
      details: data.details ?? undefined,
    },
  });
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
) {
  return { items, total, page, pageSize };
}

export function escapeContains(value: string) {
  return { contains: value, mode: "insensitive" as const };
}
