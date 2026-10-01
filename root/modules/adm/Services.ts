import { RepositoryAdm } from "./Repository.js";
import bcrypt from "bcrypt";

const repository = new RepositoryAdm();

export const ServiceAdm = {
  async CreateService(email: string, IdCreator: number) {
    const validateNewEmail = await repository.FindAdminByEmail(email);

    const validadeCreator = await repository.FindAdminById(IdCreator);

    if (!validadeCreator)
      throw new Error("Administrador criador não encontrado!");

    if (validateNewEmail) {
      throw new Error("Email já cadastrado!");
    }

    // enviar o email para o email informado com um link de confirmação para criar a senha do novo administrador

    return true;
  },

  async FindAllAdmins(id: number) {
    const adminExists = await repository.FindAdminById(id);

    if (!adminExists) throw new Error("Administrador não encontrado!");

    return await repository.FindAllAdmins();
  },

  async deleteAdmin(id: number, idToDelete: number) {
    const adminExists = await repository.FindAdminById(id);

    if (!adminExists) throw new Error("Administrador não encontrado!");

    const adminToDelete = await repository.FindAdminById(idToDelete);

    if (!adminToDelete)
      throw new Error("Administrador a ser deletado não encontrado!");

    return await repository.deleteAdmin(idToDelete);
  },

  async updateAdmin(
    id: number,
    idToUpdate: number,
    newEmail: string,
    newPassword: string,
  ) {
    const adminExists = await repository.FindAdminById(id);

    if (!adminExists) throw new Error("Administrador não encontrado!");

    const adminToUpdate = await repository.FindAdminById(idToUpdate);

    if (!adminToUpdate)
      throw new Error("Administrador a ser atualizado não encontrado!");

    return await repository.updateAdmin(idToUpdate, newEmail, newPassword);
  },

  async findAdminById(id: number, idToFind: number) {
    const adminExists = await repository.FindAdminById(id);

    if (!adminExists) throw new Error("Administrador não encontrado!");

    const adminToFind = await repository.FindAdminById(idToFind);

    if (!adminToFind)
      throw new Error("Administrador a ser encontrado não encontrado!");

    return adminToFind;
  },
};
