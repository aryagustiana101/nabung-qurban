import { computePagination } from "@repo/common";
import { type Prisma, parseCategory } from "@repo/database";
import { routerSchema } from "~/schemas/category-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const categoryRouter = createTRPCRouter({
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.CategoryWhereInput = {
        name:
          input.keyword && input.keyword.length > 0
            ? { contains: input.keyword }
            : undefined,
      };

      const records = await db.category.findMany({
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

      const count = await db.category.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records[records.length - 1]?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit <= 2
          ? ((
              await db.category.findFirst({
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
            return parseCategory({ locale, timezone, category: record });
          }),
        },
      };
    }),
});
