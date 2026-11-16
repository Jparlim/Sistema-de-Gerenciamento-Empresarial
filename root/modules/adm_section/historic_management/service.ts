import { AppError } from "../../../infra/error/AppError.js";
import { repositoryManager } from "./repository.js";

const repository = new repositoryManager();

interface actorIdODT {
  id: number;
  nome: string;
  email: string;
}

export const historicService = {
  async consultActors() {
    return await repository.filterActors();
  },

  async consultHistoric(
    search: string,
    actorId: actorIdODT,
    action: string,
    from: string,
    to: string,
  ) {
    const verify = await repository.filterActorsById(actorId.id);
    // deixar por precaução
    if (!verify) {
      throw new AppError(404, "administrador não encontrado!");
    }

    return await repository.filterHistoric(search, actorId, action, from, to);
  },
};
