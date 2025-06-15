import { computePagination } from "@repo/common";
import { type Prisma, parseDiscount } from "@repo/database";
import { routerSchema } from "~/schemas/discount-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const discountRouter = createTRPCRouter({
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.DiscountWhereInput = {
        level:
          input.levels && input.levels.length > 0
            ? { in: input.levels }
            : undefined,
        type:
          input.types && input.types.length > 0
            ? { in: input.types }
            : undefined,
        OR:
          input.keyword && input.keyword.length > 0
            ? [{ name: { contains: input.keyword } }]
            : undefined,
      };

      const records = await db.discount.findMany({
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

      const count = await db.discount.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records.at(-1)?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit <= 2
          ? ((
              await db.discount.findFirst({
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
            return parseDiscount({ locale, timezone, discount: record });
          }),
        },
      };
    }),
});
