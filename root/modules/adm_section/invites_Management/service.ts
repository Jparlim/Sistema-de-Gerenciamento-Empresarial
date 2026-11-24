import { createHash, randomBytes } from "node:crypto";
import { AppError } from "../../../infra/error/AppError.js";
import { repositoryManagement } from "./repository.js";

enum statusOption {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

interface invitedByIdODT {
  id: number;
  nome: string;
  email: string;
}

interface inviteODT {
  id: number;
  email: string;
  invitedById: number;
  invitedBy: invitedByIdODT;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
}

const repository = new repositoryManagement();

export const serviceManagement = {
  async consultInvitesService(search?: string, status?: statusOption) {
    let data;

    switch (status) {
      case statusOption.ACCEPTED:
        data = await repository.consultAcceptedInvites(search);
        break;

      case statusOption.EXPIRED:
        data = await repository.consultExpiredInvites(search);
        break;

      case statusOption.PENDING:
        data = await repository.consultPengingInvites(search);
        break;

      case statusOption.REVOKED:
        data = await repository.consultRevokedInvites(search);
        break;

      case undefined:
        data = await repository.consultAllInvites(search);
        break;
    }

    const formatData: inviteODT[] = data?.map((invite) => ({
      ...invite,
      invitedBy: {
        id: invite.invitedBy.id,
        email: invite.invitedBy.email,
        nome: invite.invitedBy.nome,
      },
    }));

    return {
      items: formatData,
      total: formatData.length,
      page: 1,
      pageSize: 10,
    };
  },

  async createInviteService(id: number, emailToSend: string) {
    const verify = await repository.findOwner(id);

    if (!verify) {
      throw new AppError(404, "admin sem permissão para esta ação!");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const frontEndUrl = process.env.FRONTEND_URL;

    await repository.createInvite(emailToSend, id, tokenHash);

    const resetUrl = new URL("/convite-admin", frontEndUrl);
    resetUrl.searchParams.set("token", tokenHash);

    return resetUrl;
  },
};
