import { zValidator } from "@hono/zod-validator";
import { CHARACTERS, __, computePagination, randomString } from "@repo/common";
import type { Prisma } from "@repo/database";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { serializeUserApplication } from "~/lib/serializer";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/user-application-schema";
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
    const levels = input.levels ?? [];
    const statuses = input.statuses ?? [];

    const where: Prisma.UserApplicationWhereInput = {
      userId: user.id,
      type: types.length > 0 ? { in: types } : undefined,
      level: levels.length > 0 ? { in: levels } : undefined,
      status: statuses.length > 0 ? { in: statuses } : undefined,
      OR: keyword
        ? [
            { name: { contains: keyword } },
            { phoneNumber: { contains: keyword } },
            { email: { contains: keyword } },
            { address: { contains: keyword } },
            { institutionName: { contains: keyword } },
            { institutionDeedEstablishment: { contains: keyword } },
            { vehiclePlateNumber: { contains: keyword } },
            { vehicleFleetType: { contains: keyword } },
            { bankName: { contains: keyword } },
            { bankAccountNumber: { contains: keyword } },
            { remark: { contains: keyword } },
          ]
        : undefined,
    };

    const userApplications = await db.userApplication.findMany({
      where,
      take: limit,
      orderBy: { id: "desc" },
      skip: page * limit - limit,
      include: { userApplicationHistories: true },
    });

    const count = await db.userApplication.count({ where });

    return c.json(
      {
        success: true,
        message: null,
        result: {
          count,
          pagination: transformRecord(
            computePagination({ type: "offset", count, limit, page }),
          ),
          records: userApplications.map((record) => {
            return transformRecord(
              serializeUserApplication({ locale, record, timezone }),
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
    const { user, timezone, locale } = c.var;

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    const record = await db.userApplication.findUnique({
      include: { userApplicationHistories: true },
      where: { code: input.code, userId: user.id },
    });

    if (!record) {
      return c.json(
        { success: false, message: "Application not found", result: null },
        { status: 404 },
      );
    }

    return c.json(
      {
        success: true,
        message: null,
        result: transformRecord(
          serializeUserApplication({
            locale,
            timezone,
            record,
          }),
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

    const bank = input.bank;
    const vehicle = input.vehicle;
    const individual = input.individual;
    const institution = input.institution;

    if (!individual && !institution) {
      return c.json(
        {
          success: false,
          message: __("required", { attribute: "individual or institution" }),
          result: null,
        },
        { status: 400 },
      );
    }

    if (
      !individual &&
      (input.level === "individual" || input.type === "antar_qurban")
    ) {
      return c.json(
        {
          success: false,
          message: __("required", { attribute: "individual" }),
          result: null,
        },
        { status: 400 },
      );
    }

    if (!institution && input.level === "institution") {
      return c.json(
        {
          success: false,
          message: __("required", { attribute: "institution" }),
          result: null,
        },
        { status: 400 },
      );
    }

    if (!bank && input.type === "pejuang_qurban") {
      return c.json(
        {
          success: false,
          message: __("required", { attribute: "bank" }),
          result: null,
        },
        { status: 400 },
      );
    }

    if (!vehicle && input.type === "antar_qurban") {
      return c.json(
        {
          success: false,
          message: __("required", { attribute: "vehicle" }),
          result: null,
        },
        { status: 400 },
      );
    }

    if (
      institution &&
      input.level === "institution" &&
      input.type === "antar_qurban"
    ) {
      return c.json(
        {
          success: false,
          message: "Institution is not allowed for Antar Qurban",
          result: null,
        },
        { status: 400 },
      );
    }

    if (
      vehicle &&
      vehicle.carryingWeight <= 0 &&
      input.type === "antar_qurban"
    ) {
      return c.json(
        {
          success: false,
          message: "Vehicle carrying weight must be greater than 0",
          result: null,
        },
        { status: 400 },
      );
    }

    const count = await db.userApplication.count({
      where: {
        userId: user.id,
        type: input.type,
        status: { in: ["pending", "process", "approved"] },
      },
    });

    if (count > 0) {
      return c.json(
        {
          success: false,
          message: "User already have an application in progress",
          result: null,
        },
        { status: 400 },
      );
    }

    await db.userApplication.create({
      data: {
        userId: user.id,
        code: randomString(12, {
          characters: CHARACTERS.ALPHANUMERIC,
        }).toUpperCase(),
        level: input.level,
        type: input.type,
        status: "pending",
        name: individual?.name ?? institution?.picName ?? "",
        phoneNumber: individual?.phoneNumber ?? institution?.phoneNumber ?? "",
        email: individual?.email ?? institution?.email ?? "",
        address: individual?.address ?? institution?.address ?? "",
        bankName: bank?.name ?? "",
        bankAccountNumber: bank?.accountNumber ?? "",
        jacketSize: input.jacket.size,
        jacketPickupMethod: input.jacket.pickupMethod,
        jacketPaymentMethod: input.jacket.paymentMethod,
        identityCardImage: individual?.identityCardImage ?? "",
        selfieImage: individual?.selfieImage ?? "",
        institutionName: institution?.name ?? "",
        institutionDeedEstablishment: institution?.deedEstablishment ?? "",
        institutionOfficeImage: institution?.officeImage ?? "",
        vehiclePlateNumber: vehicle?.plateNumber ?? "",
        vehicleFleetType: vehicle?.fleetType ?? "",
        vehicleCarryingWeight: vehicle?.carryingWeight ?? 0,
        vehicleRegistrationImage: vehicle?.registrationImage ?? "",
        remark: null,
        userApplicationHistories: { create: { status: "pending" } },
      },
    });

    return c.json(
      { success: true, message: "Create application success", result: null },
      { status: 200 },
    );
  },
);

export default app;
