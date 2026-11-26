import { repositoryManager } from "./repository.js";
const repository = new repositoryManager();
export const historicService = {
    async consultActors() {
        return repository.filterActors();
    },
    async consultHistoric(query) {
        return repository.filterHistoric(query);
    },
};
