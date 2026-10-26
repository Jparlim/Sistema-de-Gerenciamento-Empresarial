import { RepositoryLogin } from "./Repository.js";
import bcrypt from "bcrypt";
import { randomBytes, createHash } from "node:crypto";
import { AppError } from "../../infra/error/AppError.js";
import { sendForgotPasswordEmail } from "../../workflows/handleEmail/forgotpassword/index.js";
import dotenv from "dotenv";
dotenv.config();

const repository = new RepositoryLogin();

export const ServiceLogin = {
  async validateUser(email: string, senha: string) {
    const verify = await repository.findUserByEmail(email);

    if (!verify) {
      throw new AppError(401, "Email ou senha inválidos!");
    }

    const passwordHash = await bcrypt.compare(senha, verify!.senha!);

    if (!passwordHash) {
      throw new AppError(401, "Email ou senha inválidos!");
    }

    return verify!.id;
  },

  async validateAdmin(email: string, senha: string) {
    const verify = await repository.findAdminByEmail(email);

    if (senha !== verify?.senha) {
      throw new AppError(401, "Email ou senha inválidos!");
    }

    return verify.id;
  },

  async forgotPassword(email: string) {
    const verify = await repository.findUserByEmail(email);

    if (!verify) {
      throw new AppError(404, "Email não encontrado!");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await repository.createForgotPasswordEntry(email, tokenHash, expiresAt);

    return sendForgotPasswordEmail(
      email,
      `${process.env.SERVER_ORIGIN}/reset-password?token=${token}`,
    );
  },

  async createNewPassword(password: string, token: string) {
    const validate = await repository.findForgotPasswordEntry(token);

    if (!validate) {
      throw new AppError(404, "token não correspondente!");
    }

    await repository.changePassword(validate.email, password);
  },
};
