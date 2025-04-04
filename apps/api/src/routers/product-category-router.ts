import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import { type Prisma, parseProductCategory } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/product-category-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get(
  "/",
  zValidator("query", routerSchema.getMultiple, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("query");
    const { timezone, locale } = c.var;

    const page = input.page ?? 1;
    const keyword = input.keyword;
    const limit = input.limit ?? 10;

    const where: Prisma.ProductCategoryWhereInput = {
      OR: keyword ? [{ name: { contains: keyword } }] : undefined,
    };

    const productCategories = await db.productCategory.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
    });

    const count = await db.productCategory.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: productCategories.map((productCategory) => {
            return transformRecord(
              parseProductCategory({ locale, timezone, productCategory }),
            );
          }),
        },
      },
      { status: 200 },
    );
  },
);

app.get(
  "/:code",
  zValidator("param", routerSchema.getSingle, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("param");
    const { timezone, locale } = c.var;

    const productCategory = await db.productCategory.findUnique({
      where: { code: input.code },
    });

    if (!productCategory) {
      return c.json(
        { success: false, message: "Product category not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(
          parseProductCategory({ locale, timezone, productCategory }),
        ),
      },
      { status: 200 },
    );
  },
);

export default app;
