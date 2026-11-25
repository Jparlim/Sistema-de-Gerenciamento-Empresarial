import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { Prisma } from "../../../infra/database/client.js";
import { AppError } from "../../../infra/error/AppError.js";
import { sendInviteToNewAdmin } from "../../../workflows/handleEmail/sendInviteNewAdmin/index.js";
import { inviteQuerySchema, paginate, writeAudit } from "../shared.js";

const selectInvite = {
  id: true,
  email: true,
  invitedById: true,
  invitedBy: { select: { id: true, nome: true, email: true } },
  createdAt: true,
  expiresAt: true,
  acceptedAt: true,
  revokedAt: true,
} as const;
const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const pendingAt = (now: Date) => ({
  acceptedAt: null,
  revokedAt: null,
  expiresAt: { gt: now },
});

function inviteUrl(token: string) {
  const frontend = process.env.FRONTEND_URL;
  if (!frontend)
    throw new AppError(500, "A URL do frontend não está configurada.");
  const url = new URL("/convite-admin", frontend);
  url.searchParams.set("token", token);
  return url.toString();
}

export const serviceManagement = {
  async consultInvitesService(rawQuery: unknown) {
    const query = inviteQuerySchema.parse(rawQuery);
    const now = new Date();
    const where = {
      ...(query.search
        ? { email: { contains: query.search, mode: "insensitive" as const } }
        : {}),
      ...(query.status === "ACCEPTED" ? { acceptedAt: { not: null } } : {}),
      ...(query.status === "REVOKED"
        ? { acceptedAt: null, revokedAt: { not: null } }
        : {}),
      ...(query.status === "EXPIRED"
        ? { acceptedAt: null, revokedAt: null, expiresAt: { lte: now } }
        : {}),
      ...(query.status === "PENDING" ? pendingAt(now) : {}),
    };
    const [total, items] = await Promise.all([
      Prisma.adminInvite.count({ where }),
      Prisma.adminInvite.findMany({
        where,
        select: selectInvite,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
    ]);
    return paginate(items, total, query.page, query.pageSize);
  },

  async createInviteService(ownerId: number, rawEmail: string) {
    const email = rawEmail.trim().toLowerCase();
    if (!zodEmail(email)) throw new AppError(400, "Informe um e-mail válido.");
    const owner = await Prisma.admin.findUnique({
      where: { id: ownerId },
      select: { id: true, role: true, ativo: true },
    });
    if (!owner || owner.role !== "OWNER" || !owner.ativo)
      throw new AppError(
        403,
        "Somente um OWNER ativo pode convidar administradores.",
      );
    if (
      await Prisma.admin.findUnique({ where: { email }, select: { id: true } })
    )
      throw new AppError(409, "Já existe um administrador com este e-mail.");
    if (
      await Prisma.adminInvite.findFirst({
        where: { email, ...pendingAt(new Date()) },
        select: { id: true },
      })
    )
      throw new AppError(
        409,
        "Já existe um convite pendente para este e-mail.",
      );
    const token = randomBytes(32).toString("hex");
    const invite = await Prisma.adminInvite.create({
      data: {
        email,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        invitedById: ownerId,
      },
    });
    try {
      await sendInviteToNewAdmin(email, inviteUrl(token));
    } catch {
      await Prisma.adminInvite
        .update({ where: { id: invite.id }, data: { revokedAt: new Date() } })
        .catch(() => undefined);
      throw new AppError(502, "Não foi possível enviar o convite por e-mail.");
    }
    await Prisma.$transaction((tx) =>
      writeAudit(tx, {
        actorId: ownerId,
        action: "ADMIN_INVITED",
        targetType: "AdminInvite",
        targetId: invite.id,
        details: { operation: "CREATE", email },
      }),
    );
    return { success: true, message: "Convite enviado com sucesso." };
  },

  async resendInviteService(ownerId: number, inviteId: number) {
    const current = await Prisma.adminInvite.findUnique({
      where: { id: inviteId },
      select: selectInvite,
    });
    if (!current) throw new AppError(404, "Convite não encontrado.");
    if (
      current.acceptedAt ||
      current.revokedAt ||
      current.expiresAt <= new Date()
    )
      throw new AppError(
        409,
        "Somente convites pendentes podem ser reenviados.",
      );
    const token = randomBytes(32).toString("hex");
    const created = await Prisma.$transaction(async (tx) => {
      const latest = await tx.adminInvite.findUnique({
        where: { id: inviteId },
        select: {
          acceptedAt: true,
          revokedAt: true,
          expiresAt: true,
          email: true,
        },
      });
      if (
        !latest ||
        latest.acceptedAt ||
        latest.revokedAt ||
        latest.expiresAt <= new Date()
      )
        throw new AppError(
          409,
          "Somente convites pendentes podem ser reenviados.",
        );
      await tx.adminInvite.update({
        where: { id: inviteId },
        data: { revokedAt: new Date() },
      });
      const next = await tx.adminInvite.create({
        data: {
          email: latest.email,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          invitedById: ownerId,
        },
      });
      return next;
    });
    try {
      await sendInviteToNewAdmin(current.email, inviteUrl(token));
    } catch {
      await Prisma.adminInvite
        .update({ where: { id: created.id }, data: { revokedAt: new Date() } })
        .catch(() => undefined);
      throw new AppError(502, "Não foi possível enviar o convite por e-mail.");
    }
    await Prisma.$transaction((tx) =>
      writeAudit(tx, {
        actorId: ownerId,
        action: "ADMIN_INVITED",
        targetType: "AdminInvite",
        targetId: created.id,
        details: { operation: "RESEND", email: current.email },
      }),
    );
    return { success: true, message: "Convite reenviado com sucesso." };
  },

  async revokeInviteService(ownerId: number, inviteId: number) {
    await Prisma.$transaction(async (tx) => {
      const invite = await tx.adminInvite.findUnique({
        where: { id: inviteId },
        select: {
          id: true,
          email: true,
          acceptedAt: true,
          revokedAt: true,
          expiresAt: true,
        },
      });
      if (!invite) throw new AppError(404, "Convite não encontrado.");
      if (
        invite.acceptedAt ||
        invite.revokedAt ||
        invite.expiresAt <= new Date()
      )
        throw new AppError(
          409,
          "Somente convites pendentes podem ser revogados.",
        );
      await tx.adminInvite.update({
        where: { id: inviteId },
        data: { revokedAt: new Date() },
      });
      await writeAudit(tx, {
        actorId: ownerId,
        action: "ADMIN_INVITE_REVOKED",
        targetType: "AdminInvite",
        targetId: inviteId,
        details: { email: invite.email },
      });
    });
    return { success: true, message: "Convite revogado com sucesso." };
  },

  async validateInvite(token: string) {
    if (!token || token.length > 500)
      throw new AppError(400, "Token inválido.");
    const invite = await Prisma.adminInvite.findUnique({
      where: { tokenHash: hashToken(token) },
      select: {
        email: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
    if (!invite || invite.acceptedAt || invite.revokedAt)
      throw new AppError(404, "Convite inválido ou já utilizado.");
    if (invite.expiresAt <= new Date())
      throw new AppError(410, "Este convite expirou.");
    return { email: invite.email, expiresAt: invite.expiresAt.toISOString() };
  },

  async acceptInvite(token: string, nome: string, senha: string) {
    if (!token || token.length > 500)
      throw new AppError(400, "Token inválido.");
    const name = nome.trim();
    if (!name || name.length > 200 || senha.length < 6 || senha.length > 200)
      throw new AppError(400, "Nome ou senha inválidos.");
    const tokenHash = hashToken(token);
    const passwordHash = await bcrypt.hash(senha, 10);
    await Prisma.$transaction(async (tx) => {
      const invite = await tx.adminInvite.findUnique({ where: { tokenHash } });
      if (!invite || invite.acceptedAt || invite.revokedAt)
        throw new AppError(404, "Convite inválido ou já utilizado.");
      if (invite.expiresAt <= new Date())
        throw new AppError(410, "Este convite expirou.");
      if (
        await tx.admin.findUnique({
          where: { email: invite.email },
          select: { id: true },
        })
      )
        throw new AppError(409, "Já existe um administrador com este e-mail.");
      const admin = await tx.admin.create({
        data: {
          nome: name,
          email: invite.email,
          senha: passwordHash,
          role: "ADMIN",
        },
        select: { id: true },
      });
      await tx.adminInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        action: "ADMIN_INVITE_ACCEPTED",
        targetType: "AdminInvite",
        targetId: invite.id,
        details: { email: invite.email },
      });
    });
    return {
      success: true,
      message: "Conta administrativa criada com sucesso.",
    };
  },
};

function zodEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
