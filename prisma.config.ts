import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  migrations: {
    seed: "tsx ./root/infra/database/prisma/seed/index.ts",
  },
  schema: "./root/infra/database/prisma/schema.prisma",
});
