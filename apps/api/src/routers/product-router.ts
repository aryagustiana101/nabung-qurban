import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import type { Prisma } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { parseProductRecord } from "~/lib/parser";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/product-schema";
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
    const statuses = input.statuses ?? [];
    const services = input.services ?? [];
    const categories = input.categories ?? [];

    const where: Prisma.ProductWhereInput = {
      OR: keyword ? [{ name: { contains: keyword } }] : undefined,
      status: statuses.length > 0 ? { in: statuses } : undefined,
      productServices:
        services.length > 0
          ? { some: { service: { code: { in: services } } } }
          : undefined,
      productCategoryEntries:
        categories.length > 0
          ? { some: { productCategory: { code: { in: categories } } } }
          : undefined,
    };

    const records = await db.product.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
      include: {
        productServices: { include: { service: true } },
        productCategoryEntries: { include: { productCategory: true } },
        productVariants: {
          include: {
            productVariantDiscounts: {
              orderBy: { id: "desc" },
              include: { discount: true },
            },
            productVariantAttributeEntries: {
              include: { productVariantAttribute: true },
            },
          },
        },
      },
    });

    const count = await db.product.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: records.map((record) => {
            return transformRecord(
              parseProductRecord({ locale, timezone, record }),
            );
          }),
        },
      },
      { status: 200 },
    );
  },
);

app.get(
  "/:id",
  zValidator("param", routerSchema.getSingle, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("param");
    const { timezone, locale } = c.var;

    const record = await db.product.findUnique({
      where: { id: input.id },
      include: {
        productServices: { include: { service: true } },
        productCategoryEntries: { include: { productCategory: true } },
        productVariants: {
          include: {
            productVariantDiscounts: {
              orderBy: { id: "desc" },
              include: { discount: true },
            },
            productVariantAttributeEntries: {
              include: { productVariantAttribute: true },
            },
          },
        },
      },
    });

    if (!record) {
      return c.json(
        { success: false, message: "Product not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(
          parseProductRecord({ locale, timezone, record }),
        ),
      },
      { status: 200 },
    );
  },
);

export default app;
