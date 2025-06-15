import { computePagination } from "@repo/common";
import { type Prisma, parseEntrant } from "@repo/database";
import { routerSchema } from "~/schemas/entrant-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const entrantRouter = createTRPCRouter({
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.EntrantWhereInput = {
        OR:
          input.keyword && input.keyword.length > 0
            ? [
                { code: { contains: input.keyword } },
                { name: { contains: input.keyword } },
                { label: { contains: input.keyword } },
                { description: { contains: input.keyword } },
              ]
            : undefined,
      };

      const records = await db.entrant.findMany({
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

      const count = await db.entrant.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records.at(-1)?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit <= 2
          ? ((
              await db.entrant.findFirst({
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
            return parseEntrant({ locale, timezone, entrant: record });
          }),
        },
      };
    }),
});
