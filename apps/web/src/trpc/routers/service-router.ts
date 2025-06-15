import { computePagination } from "@repo/common";
import { type Prisma, parseService } from "@repo/database";
import { routerSchema } from "~/schemas/service-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(routerSchema.getAll)
    .query(async ({ input, ctx: { db } }) => {
      const records = await db.service.findMany({
        select: { code: true },
        orderBy: { code: "asc" },
        where: {
          status:
            input.statuses && input.statuses.length > 0
              ? { in: input.statuses }
              : undefined,
          level:
            input.levels && input.levels.length > 0
              ? { in: input.levels }
              : undefined,
        },
      });

      return {
        success: true,
        message: null,
        result: records.map(({ code }) => {
          return code;
        }),
      };
    }),
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.ServiceWhereInput = {
        status:
          input.statuses && input.statuses.length > 0
            ? { in: input.statuses }
            : undefined,
        level:
          input.levels && input.levels.length > 0
            ? { in: input.levels }
            : undefined,
        scopes:
          input.scopes && input.scopes.length > 0
            ? { array_contains: input.scopes }
            : undefined,
        OR:
          input.keyword && input.keyword.length > 0
            ? [
                { code: { contains: input.keyword } },
                { name: { contains: input.keyword } },
                { description: { contains: input.keyword } },
              ]
            : undefined,
      };

      const records = await db.service.findMany({
        where,
        take: limit,
        orderBy: { id: "desc" },
        cursor:
          typeof cursor === "number" && pagination === "cursor"
            ? { id: cursor }
            : undefined,
        skip:
          typeof cursor === "number" && pagination === "cursor"
            ? 1
            : pagination === "offset"
              ? page * limit - limit
              : undefined,
      });

      const count = await db.service.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records.at(-1)?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit <= 2
          ? ((
              await db.service.findFirst({
                where,
                take: 1,
                select: { id: true },
                orderBy: { id: "asc" },
              })
            )?.id ?? null)
          : null;

      return {
        success: true,
        message: null,
        result: {
          pagination: computePagination({
            page,
            limit,
            count,
            cursor,
            type: pagination,
            next: next !== last ? next : null,
          }),
          records: records.map((record) => {
            return parseService({ locale, timezone, service: record });
          }),
        },
      };
    }),
});
