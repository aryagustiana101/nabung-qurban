import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import { type Prisma, parseWarehouse } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/warehouse-schema";
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

    const where: Prisma.WarehouseWhereInput = {
      status: statuses.length > 0 ? { in: statuses } : undefined,
      OR: keyword
        ? [
            { name: { contains: keyword } },
            { province: { contains: keyword } },
            { city: { contains: keyword } },
            { district: { contains: keyword } },
            { postalCode: { contains: keyword } },
            { address: { contains: keyword } },
          ]
        : undefined,
    };

    const warehouses = await db.warehouse.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
    });

    const count = await db.warehouse.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: warehouses.map((warehouse) => {
            return transformRecord(
              parseWarehouse({ locale, timezone, warehouse }),
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

    const warehouse = await db.warehouse.findUnique({
      where: { code: input.code },
    });

    if (!warehouse) {
      return c.json(
        { success: false, message: "Warehouse not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(
          parseWarehouse({ locale, timezone, warehouse }),
        ),
      },
      { status: 200 },
    );
  },
);

export default app;
