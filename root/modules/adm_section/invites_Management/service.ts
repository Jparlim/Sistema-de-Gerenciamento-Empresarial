import { repositoryManagement } from "./repository.js";

enum statusOption {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

interface teste1 {
  id: number;
  nome: string;
  email: string;
}

interface teste {
  id: number;
  email: string;
  invitedById: number;
  invitedBy: teste1;
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

    const formatData: teste[] = data?.map((invite) => ({
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
};
