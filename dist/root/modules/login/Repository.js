import { Prisma } from "../../infra/database/client.js";
export class RepositoryLogin {
    async findUserByEmail(email) {
        return await Prisma.company.findUnique({
            where: {
                email: email,
            },
        });
    }
    async findAdminByEmail(email) {
        return await Prisma.admin.findUnique({
            where: {
                email: email,
            },
        });
    }
    async updateAdminLastLogin(id) {
        return Prisma.admin.update({ where: { id }, data: { lastLoginAt: new Date() }, select: { id: true } });
    }
    async createForgotPasswordEntry(email, tokenHash, expiresAt) {
        return await Prisma.forgotPassword.create({
            data: {
                email: email,
                token: tokenHash,
                token_expires: expiresAt,
            },
        });
    }
    async findForgotPasswordEntry(token) {
        return await Prisma.forgotPassword.findFirst({
            where: {
                token: token,
            },
        });
    }
    async changeForgotPasswordEntry(token, expires, email) {
        return await Prisma.forgotPassword.update({
            where: { email: email },
            data: {
                token: token,
                token_expires: expires,
            },
        });
    }
    async changePassword(email, password) {
        return await Prisma.company.update({
            where: { email: email },
            data: {
                senha: password,
            },
            include: {
                estoque: true,
            },
        });
    }
    async deleteForgotPasswor(email, token) {
        return await Prisma.forgotPassword.delete({
            where: {
                email: email,
                token: token,
            },
        });
    }
}
