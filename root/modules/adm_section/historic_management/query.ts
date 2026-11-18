import { z } from "zod";

export const auditActions = [
  "ADMIN_INVITED",
  "ADMIN_INVITE_REVOKED",
  "ADMIN_INVITE_ACCEPTED",
  "ADMIN_DEACTIVATED",
  "ADMIN_REACTIVATED",
  "COMPANY_DEACTIVATED",
  "COMPANY_REACTIVATED",
] as const;

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Data inválida");

const positiveIntegerQuery = (defaultValue: number, maximum: number) =>
  z.preprocess(
    (value) => (value === undefined ? defaultValue : value),
    z.preprocess(
      (value) =>
        typeof value === "string" && /^\d+$/.test(value)
          ? Number(value)
          : value,
      z.number().int().min(1).max(maximum),
    ),
  );

export const auditLogQuerySchema = z
  .object({
    search: z
      .string()
      .trim()
      .max(200, "A busca deve ter no máximo 200 caracteres")
      .optional()
      .transform((value) => (value ? value : undefined)),
    actorId: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.preprocess(
        (value) =>
          typeof value === "string" && /^\d+$/.test(value)
            ? Number(value)
            : value,
        z.number().int().positive().optional(),
      ),
    ),
    action: z.enum(auditActions).optional(),
    from: dateOnlySchema.optional(),
    to: dateOnlySchema.optional(),
    page: positiveIntegerQuery(1, 1_000_000),
    pageSize: positiveIntegerQuery(10, 100),
  })
  .superRefine((query, context) => {
    if (query.from && query.to && query.from > query.to) {
      context.addIssue({
        code: "custom",
        path: ["from"],
        message: "A data inicial deve ser anterior ou igual à data final",
      });
    }
  });

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;

const allowedChangeFields = new Set([
  "nome",
  "email",
  "status",
  "ativo",
  "cargo",
  "justificativa",
  "createdAt",
  "expiresAt",
  "acceptedAt",
  "revokedAt",
  "CNPJ",
  "telefone",
]);

type Primitive = string | number | boolean | null;
type ProjectedChange = { field: string; from: Primitive; to: Primitive };

function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

export function projectAuditDetails(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const details = value as Record<string, unknown>;
  const projected: Record<string, unknown> = {};

  if (details.operation === "CREATE" || details.operation === "RESEND") {
    projected.operation = details.operation;
  }

  for (const key of ["statusReason", "reason", "email"] as const) {
    if (typeof details[key] === "string") projected[key] = details[key];
  }

  for (const key of ["previousStatus", "newStatus"] as const) {
    if (typeof details[key] === "boolean") projected[key] = details[key];
  }

  if (Array.isArray(details.changes)) {
    const changes: ProjectedChange[] = [];

    for (const change of details.changes) {
      if (!change || typeof change !== "object" || Array.isArray(change)) {
        continue;
      }

      const candidate = change as Record<string, unknown>;
      if (
        typeof candidate.field === "string" &&
        allowedChangeFields.has(candidate.field) &&
        isPrimitive(candidate.from) &&
        isPrimitive(candidate.to)
      ) {
        changes.push({
          field: candidate.field,
          from: candidate.from,
          to: candidate.to,
        });
      }
    }

    projected.changes = changes;
  }

  return projected;
}

export interface AuditLogRecord {
  id: number;
  actorId: number;
  actor: { id: number; nome: string; email: string } | null;
  action: (typeof auditActions)[number];
  targetType: string;
  targetId: number;
  createdAt: Date;
  details: unknown;
}

export function filterAndPaginateAuditLogs(
  records: AuditLogRecord[],
  query: { search?: string; page: number; pageSize: number },
) {
  const orderedRecords = [...records].sort(
    (left, right) =>
      right.createdAt.getTime() - left.createdAt.getTime() ||
      right.id - left.id,
  );
  const search = query.search?.toLowerCase();
  const matchingRecords = orderedRecords.filter((record) => {
    if (!search) return true;

    const details = projectAuditDetails(record.details);
    const searchValues = [
      record.actorId,
      record.actor?.id,
      record.actor?.nome,
      record.actor?.email,
      record.action,
      record.targetType,
      record.targetId,
      ...Object.values(details).flatMap((value) =>
        Array.isArray(value)
          ? value.flatMap((item) =>
              item && typeof item === "object"
                ? Object.values(item as Record<string, unknown>)
                : [item],
            )
          : [value],
      ),
    ];

    return searchValues.some(
      (value) =>
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean") &&
        String(value).toLowerCase().includes(search),
    );
  });

  const start = (query.page - 1) * query.pageSize;
  return {
    items: matchingRecords
      .slice(start, start + query.pageSize)
      .map((record) => ({
        id: record.id,
        actorId: record.actorId,
        actor: record.actor
          ? {
              id: record.actor.id,
              nome: record.actor.nome,
              email: record.actor.email,
            }
          : null,
        action: record.action,
        targetType: record.targetType,
        targetId: record.targetId,
        createdAt: record.createdAt.toISOString(),
        details: projectAuditDetails(record.details),
      })),
    total: matchingRecords.length,
    page: query.page,
    pageSize: query.pageSize,
  };
}

const saoPauloDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function getSaoPauloOffset(timestamp: number): number {
  const parts = Object.fromEntries(
    saoPauloDateFormatter
      .formatToParts(new Date(timestamp))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return localAsUtc - timestamp;
}

export function saoPauloDayStart(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const offsets = new Set<number>();

  for (let hours = -36; hours <= 36; hours += 6) {
    offsets.add(getSaoPauloOffset(utcMidnight + hours * 60 * 60 * 1000));
  }

  const candidates = [...offsets]
    .map((offset) => utcMidnight - offset)
    .filter((timestamp) => {
      const parts = saoPauloDateFormatter.formatToParts(new Date(timestamp));
      const localDate = ["year", "month", "day"]
        .map((type) => parts.find((part) => part.type === type)?.value ?? "")
        .join("-");
      return localDate === date;
    });

  if (candidates.length === 0) {
    throw new RangeError("Não foi possível converter a data para São Paulo.");
  }

  return new Date(Math.min(...candidates));
}

export function nextDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [
    next.getUTCFullYear().toString().padStart(4, "0"),
    (next.getUTCMonth() + 1).toString().padStart(2, "0"),
    next.getUTCDate().toString().padStart(2, "0"),
  ].join("-");
}

export function createAuditLogWhere(
  query: Pick<AuditLogQuery, "actorId" | "action" | "from" | "to">,
) {
  return {
    ...(query.actorId !== undefined ? { actorId: query.actorId } : {}),
    ...(query.action ? { action: query.action } : {}),
    ...(query.from || query.to
      ? {
          createdAt: {
            ...(query.from ? { gte: saoPauloDayStart(query.from) } : {}),
            ...(query.to ? { lt: saoPauloDayStart(nextDate(query.to)) } : {}),
          },
        }
      : {}),
  };
}
