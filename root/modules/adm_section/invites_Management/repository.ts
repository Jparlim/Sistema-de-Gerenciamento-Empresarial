import { email } from "zod";
import { Prisma } from "../../../infra/database/client.js";

export class repositoryManagement {
  async consultPengingInvites(search?: string) {
    return await Prisma.adminInvite.findMany({
      where: {
        email: search,
        expiresAt: {
          lt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        invitedBy: true,
        invitedById: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
  }

  async consultAcceptedInvites(search?: string) {
    return await Prisma.adminInvite.findMany({
      where: {
        email: search,
        acceptedAt: { not: null },
      },
      select: {
        id: true,
        email: true,
        invitedBy: true,
        invitedById: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
  }

  async consultExpiredInvites(search?: string) {
    return await Prisma.adminInvite.findMany({
      where: {
        email: search,
        expiresAt: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        invitedBy: true,
        invitedById: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
  }

  async consultRevokedInvites(search?: string) {
    return await Prisma.adminInvite.findMany({
      where: {
        email: search,
        revokedAt: { not: null },
      },
      select: {
        id: true,
        email: true,
        invitedBy: true,
        invitedById: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
  }

  async consultAllInvites(search?: string) {
    return await Prisma.adminInvite.findMany({
      where: {
        email: search,
      },
      select: {
        id: true,
        email: true,
        invitedBy: true,
        invitedById: true,
        createdAt: true,
        expiresAt: true,
        acceptedAt: true,
        revokedAt: true,
      },
    });
  }

  async createInvite(email: string, idFromOwner: number, tokenHash: string) {
    return await Prisma.adminInvite.create({
      data: {
        email: email,
        tokenHash: tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        invitedById: idFromOwner,
      },
    });
  }

  async findInvite(id: number, email: string) {
    return await Prisma.adminInvite.findFirst({
      where: {
        email: email,
        invitedById: id,
      },
    });
  }

  async findOwner(id: number) {
    return await Prisma.admin.findUnique({
      where: { id: id },
    });
  }
}
