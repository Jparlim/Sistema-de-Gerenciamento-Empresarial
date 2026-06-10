import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function Main() {
  console.log("seed rodou com sucesso!");
}

Main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
