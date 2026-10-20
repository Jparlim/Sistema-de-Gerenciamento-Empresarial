import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL nao foi definida no ambiente.");
}

const adapter = new PrismaPg({ connectionString });

export const Prisma = new PrismaClient({ adapter });

async function Main() {
  const email = process.env.ADMIN_EMAIL as string;
  const password = process.env.ADMIN_PASSWORD as string;

  const verify = await Prisma.admin.findUnique({
    where: {
      email: email,
    },
  });

  if (verify) {
    console.log("Administrador já cadastrado!");
    return;
  }

  const hashedPassword = await bcrypt.hash(password!, 10);

  await Prisma.admin.create({
    data: {
      email: email!,
      senha: hashedPassword,
      role: "admin",
    },
  });

  console.log("Administrador cadastrado com sucesso!");
}

Main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await Prisma.$disconnect();
  });
