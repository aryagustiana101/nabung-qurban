import { zValidator } from "@hono/zod-validator";
import { computePagination } from "@repo/common";
import { type Prisma, parseUserAddress } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/user-address-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get(
  "/",
  zValidator("query", routerSchema.getMultiple, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("query");
    const { user, timezone, locale } = c.var;

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    const page = input.page ?? 1;
    const keyword = input.keyword;
    const limit = input.limit ?? 10;
    const types = input.types ?? [];

    const where: Prisma.UserAddressWhereInput = {
      userId: user.id,
      type: types.length > 0 ? { in: types } : undefined,
      OR: keyword
        ? [
            { contactName: keyword },
            { note: { contains: keyword } },
            { name: { contains: keyword } },
            { contactPhoneNumber: keyword },
            { detail: { contains: keyword } },
          ]
        : undefined,
    };

    const userAddresses = await db.userAddress.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
    });

    const count = await db.userAddress.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          count,
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: userAddresses.map((userAddress) => {
            return transformRecord(
              parseUserAddress({ locale, timezone, userAddress }),
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
    const { user, timezone, locale } = c.var;

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    const userAddress = await db.userAddress.findUnique({
      where: { id: input.id, userId: user.id },
    });

    if (!userAddress) {
      return c.json(
        { success: false, message: "Address not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(
          parseUserAddress({ locale, timezone, userAddress }),
        ),
      },
      { status: 200 },
    );
  },
);

app.post(
  "/",
  zValidator("json", routerSchema.create, zodValidatorMiddleware),
  async (c) => {
    const { user } = c.var;
    const input = c.req.valid("json");

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    const count = await db.userAddress.count({ where: { userId: user.id } });

    const userAddress = await db.userAddress.create({
      data: {
        userId: user.id,
        name: input.name,
        note: input.note,
        detail: input.detail,
        contactName: input.contactName,
        type: count <= 0 ? "main" : input.type,
        contactPhoneNumber: input.contactPhoneNumber,
        location: {
          name: input.location.name,
          detail: input.location.detail,
          coordinates: {
            latitude: input.location.coordinates.latitude,
            longitude: input.location.coordinates.longitude,
          },
        },
      },
    });

    if (count > 0 && userAddress.type === "main") {
      await db.userAddress.updateMany({
        data: { type: "alternative" },
        where: { userId: user.id, id: { not: userAddress.id } },
      });
    }

    return c.json(
      { success: true, message: "Create address success", result: null },
      { status: 200 },
    );
  },
);

app.put(
  "/:id",
  zValidator("param", routerSchema.getSingle, zodValidatorMiddleware),
  zValidator("json", routerSchema.update, zodValidatorMiddleware),
  async (c) => {
    const { user } = c.var;
    const input = c.req.valid("json");

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    let userAddress = await db.userAddress.findUnique({
      where: { userId: user.id, id: c.req.valid("param").id },
    });

    if (!userAddress) {
      return c.json(
        { success: false, message: "Address not found", result: null },
        { status: 404 },
      );
    }

    const count = await db.userAddress.count({ where: { userId: user.id } });

    userAddress = await db.userAddress.update({
      where: { id: userAddress.id },
      data: {
        userId: user.id,
        name: input.name,
        note: input.note,
        detail: input.detail,
        contactName: input.contactName,
        type: count <= 1 ? "main" : input.type,
        contactPhoneNumber: input.contactPhoneNumber,
        location: input.location
          ? {
              name: input?.location?.name,
              detail: input?.location?.detail,
              coordinates: {
                latitude: input?.location?.coordinates?.latitude,
                longitude: input?.location?.coordinates?.longitude,
              },
            }
          : undefined,
      },
    });

    if (count > 1 && userAddress.type === "main") {
      await db.userAddress.updateMany({
        data: { type: "alternative" },
        where: { userId: user.id, id: { not: userAddress.id } },
      });
    }

    return c.json(
      { success: true, message: "Update address success", result: null },
      { status: 200 },
    );
  },
);

app.delete(
  "/:id",
  zValidator("param", routerSchema.getSingle, zodValidatorMiddleware),
  async (c) => {
    const { user } = c.var;
    const input = c.req.valid("param");

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    const userAddress = await db.userAddress.findUnique({
      where: { id: input.id, userId: user.id },
    });

    if (!userAddress) {
      return c.json(
        { success: false, message: "Address not found", result: null },
        { status: 404 },
      );
    }

    if (userAddress.type === "main") {
      return c.json(
        {
          success: false,
          message: "Main address cannot be deleted",
          result: null,
        },
        { status: 400 },
      );
    }

    await db.userAddress.delete({
      where: { id: userAddress.id, userId: user.id },
    });

    return c.json(
      { success: true, message: "Delete address success", result: null },
      { status: 200 },
    );
  },
);

export default app;
