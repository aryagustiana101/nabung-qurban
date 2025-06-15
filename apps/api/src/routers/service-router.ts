import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import { type Prisma, parseService } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/service-schema";
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
    const levels = input.levels ?? [];
    const scopes = input.scopes ?? [];
    const statuses = input.statuses ?? [];

    const where: Prisma.ServiceWhereInput = {
      level: levels.length > 0 ? { in: levels } : undefined,
      status: statuses.length > 0 ? { in: statuses } : undefined,
      scopes: scopes.length > 0 ? { array_contains: scopes } : undefined,
      OR: keyword
        ? [
            { name: { contains: keyword } },
            { description: { contains: keyword } },
          ]
        : undefined,
    };

    const services = await db.service.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
    });

    const count = await db.service.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: services.map((service) => {
            return transformRecord(parseService({ locale, timezone, service }));
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

    const service = await db.service.findUnique({
      where: { code: input.code },
    });

    if (!service) {
      return c.json(
        { success: false, message: "Service not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(parseService({ locale, timezone, service })),
      },
      { status: 200 },
    );
  },
);

export default app;
