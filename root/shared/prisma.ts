//rodar npx prisma generate para gerar o cliente do prisma
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL_DEV || process.env.DATABASE_URL_PROD;

if (!connectionString) {
  throw new Error("DATABASE_URL nao foi definida no ambiente.");
}

const adapter = new PrismaPg({ connectionString });

export const Prisma = new PrismaClient({ adapter });
