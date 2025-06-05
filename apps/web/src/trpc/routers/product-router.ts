import { computePagination } from "@repo/common";
import {
  type Prisma,
  parseCategory,
  parseProduct,
  parseService,
} from "@repo/database";
import { routerSchema } from "~/schemas/product-schema";
import { createTRPCRouter, protectedProcedure } from "~/trpc/init";

export const productRouter = createTRPCRouter({
  getMultiple: protectedProcedure
    .input(routerSchema.getMultiple)
    .query(async ({ input, ctx: { db, locale, timezone } }) => {
      const cursor = input.cursor;
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const pagination = input.pagination ?? "offset";

      const where: Prisma.ProductWhereInput = {
        status:
          input.statuses && input.statuses.length > 0
            ? { in: input.statuses }
            : undefined,
        name:
          input.keyword && input.keyword.length > 0
            ? { contains: input.keyword }
            : undefined,
        productCategories:
          input.categories && input.categories.length > 0
            ? { some: { category: { code: { in: input.categories } } } }
            : undefined,
        productServices:
          input.services && input.services.length > 0
            ? { some: { service: { code: { in: input.services } } } }
            : undefined,
      };

      const records = await db.product.findMany({
        where,
        take: limit,
        orderBy: { id: "desc" },
        cursor:
          typeof cursor === "number" && pagination === "cursor"
            ? { id: cursor }
            : undefined,
        include: {
          productServices: { include: { service: true } },
          productCategories: { include: { category: true } },
        },
        skip:
          typeof cursor === "number" && pagination === "cursor"
            ? 1
            : pagination === "offset"
              ? page * limit - limit
              : undefined,
      });

      const count = await db.product.count({ where });

      const next =
        pagination === "cursor" && records.length === limit
          ? (records.at(-1)?.id ?? null)
          : null;

      const last =
        pagination === "cursor" && limit === 1
          ? ((
              await db.product.findFirst({
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
            const product = parseProduct({ locale, timezone, product: record });

            return {
              ...product,
              services: record.productServices.map(({ service }) =>
                parseService({ locale, timezone, service: service }),
              ),
              categories: record.productCategories.map(({ category }) =>
                parseCategory({ locale, timezone, category }),
              ),
            };
          }),
        },
      };
    }),
});
