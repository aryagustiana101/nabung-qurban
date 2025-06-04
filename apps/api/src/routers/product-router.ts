import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import type { Prisma } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { serializeProduct } from "~/lib/serializer";
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
    const warehouses = input.warehouses ?? [];

    const where: Prisma.ProductWhereInput = {
      OR: keyword ? [{ name: { contains: keyword } }] : undefined,
      status: statuses.length > 0 ? { in: statuses } : undefined,
      productServices:
        services.length > 0
          ? { some: { service: { code: { in: services } } } }
          : undefined,
      productCategories:
        categories.length > 0
          ? { some: { category: { code: { in: categories } } } }
          : undefined,
      productWarehouses:
        warehouses.length > 0
          ? { some: { warehouse: { code: { in: warehouses } } } }
          : undefined,
    };

    const records = await db.product.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
      include: {
        productEntrants: { include: { entrant: true } },
        productInventories: { orderBy: { id: "desc" } },
        productServices: { include: { service: true } },
        productCategories: { include: { category: true } },
        productWarehouses: {
          orderBy: { id: "desc" },
          include: { warehouse: true },
        },
        productVariants: {
          include: {
            productVariantAttributes: { include: { attribute: true } },
            productVariantDiscounts: {
              orderBy: { id: "desc" },
              include: { discount: true },
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
              serializeProduct({ locale, timezone, record }),
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
        productEntrants: { include: { entrant: true } },
        productServices: { include: { service: true } },
        productInventories: { orderBy: { id: "desc" } },
        productCategories: { include: { category: true } },
        productWarehouses: {
          orderBy: { id: "desc" },
          include: { warehouse: true },
        },
        productVariants: {
          include: {
            productVariantAttributes: { include: { attribute: true } },
            productVariantDiscounts: {
              orderBy: { id: "desc" },
              include: { discount: true },
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
        result: transformRecord(serializeProduct({ locale, timezone, record })),
      },
      { status: 200 },
    );
  },
);

export default app;
