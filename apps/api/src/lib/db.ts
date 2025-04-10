import { PrismaClient } from "@repo/database";
import { env } from "~/env";

export const db = new PrismaClient({
  log: ["error"],
  datasources: { db: { url: env.DATABASE_URL } },
  transactionOptions: { maxWait: 10_000, timeout: 20_000 },
});
