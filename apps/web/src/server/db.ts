import "server-only";

import { PrismaClient } from "@repo/database";
import { env } from "~/env";
import { APP_ENV } from "~/lib/constants";

const createPrismaClient = () =>
  new PrismaClient({
    log: ["error"],
    datasources: { db: { url: env.DATABASE_URL } },
    transactionOptions: { maxWait: 10_000, timeout: 20_000 },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (APP_ENV !== "production") {
  globalForPrisma.prisma = db;
}
