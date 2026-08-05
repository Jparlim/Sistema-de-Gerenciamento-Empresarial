import { RepositoryLogin } from "./Repository.js";
import bcrypt from "bcrypt";
import { AppError } from "../../infra/error/AppError.js";

const repository = new RepositoryLogin();

export const ServiceLogin = {
  async validateUser(email: string, senha: string) {
    const verify = await repository.findByEmail(email);

    if (!verify) {
      throw new AppError(401, "Email ou senha inválidos!");
    }

    const passwordHash = await bcrypt.compare(senha, verify.senha!);

    if (!passwordHash) {
      throw new AppError(401, "Email ou senha inválidos!");
    }

    return verify.id;
  },
};
