import { RepositoryLogin } from "./Repository.js";
import bcrypt from "bcrypt";
import { randomBytes, createHash } from "node:crypto";
import { AppError } from "../../infra/error/AppError.js";
import { sendForgotPasswordEmail } from "../../workflows/handleEmail/forgotpassword/index.js";
import dotenv from "dotenv";
import { URL } from "node:url";
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
    const verifyIfExistOnUser = await repository.findUserByEmail(email);
    const verifyIfExistOnForgotPassword =
      await repository.findForgotPasswordEntry(email);

    if (!verifyIfExistOnUser) {
      throw new AppError(404, "Email não existe em nosso banco de dados!");
    }

    if (verifyIfExistOnForgotPassword) {
      if (verifyIfExistOnForgotPassword!.created_at > new Date()) {
        const token = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await repository.changeForgotPasswordEntry(tokenHash, expiresAt, email);

        // it's necessary think better about the logic
        // I thing that don't is correct to have token expires in this end point

        throw new AppError(
          404,
          "token expirado! Reabra a página para redefinir sua senha.",
        );
      }

      const frontEndUrl = process.env.FRONTEND_URL;

      if (!frontEndUrl) {
        throw new Error("FRONTEND_URL não configurada");
      }

      const resetUrl = new URL("/reset-password", frontEndUrl);
      resetUrl.searchParams.set("token", verifyIfExistOnForgotPassword.token);

      return await sendForgotPasswordEmail(email, resetUrl.toString());
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await repository.createForgotPasswordEntry(email, tokenHash, expiresAt);

    const frontEndUrl = process.env.FRONTEND_URL;

    if (!frontEndUrl) {
      throw new Error("FRONTEND_URL não configurada");
    }

    const resetUrl = new URL("/reset-password", frontEndUrl);
    resetUrl.searchParams.set("token", token);

    return await sendForgotPasswordEmail(email, resetUrl.toString());
  },

  async createNewPassword(
    passwordOne: string,
    passwordTwo: string,
    token: string,
  ) {
    const validate = await repository.findForgotPasswordEntry(token);

    if (!validate) {
      throw new AppError(404, "token não correspondente!");
    }

    if (passwordOne !== passwordTwo) {
      throw new AppError(400, "as senhas não conferem");
    }

    const passwordHash = await bcrypt.hash(passwordOne, 10);

    return await repository.changePassword(validate.email, passwordHash);
  },
};
