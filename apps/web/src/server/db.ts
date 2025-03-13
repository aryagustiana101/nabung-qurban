import "server-only";

import { PrismaClient } from "@repo/database";
import { APP_ENV } from "~/lib/constants";

const createPrismaClient = () => new PrismaClient({ log: ["error"] });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (APP_ENV !== "production") {
  globalForPrisma.prisma = db;
}
