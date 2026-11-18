import { repositoryManager } from "./repository.js";
import { AuditLogQuery } from "./query.js";

const repository = new repositoryManager();

export const historicService = {
  async consultActors() {
    return repository.filterActors();
  },

  async consultHistoric(query: AuditLogQuery) {
    return repository.filterHistoric(query);
  },
};
