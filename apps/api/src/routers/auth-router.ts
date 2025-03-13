import { zValidator } from "@hono/zod-validator";
import { CHARACTERS, randomString } from "@repo/common";
import bcrypt from "bcryptjs";
import { addMinutes, isAfter } from "date-fns";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { env } from "~/env";
import { db } from "~/lib/db";
import { sendOtp } from "~/lib/meta";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { routerSchema } from "~/schemas/auth-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.post(
  "/login",
  zValidator("json", routerSchema.login, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("json");

    const user = await db.user.findUnique({
      where: { username: input.phoneNumber },
    });

    if (!user) {
      return c.json(
        { success: false, message: "User not found", result: null },
        { status: 404 },
      );
    }

    if (user.status !== "active") {
      return c.json(
        { success: false, message: "User status inactive", result: null },
        { status: 400 },
      );
    }

    const verified = await bcrypt.compare(input.pin, user.password);

    if (!verified) {
      return c.json(
        { success: false, message: "Invalid PIN", result: null },
        { status: 400 },
      );
    }

    const code = randomString(6, { characters: CHARACTERS.NUMERIC });

    const otpCode = await db.otpCode.create({
      data: {
        purpose: "login",
        key: randomString(),
        secret: await bcrypt.hash(code, 10),
        expiredAt: addMinutes(new Date(), 30),
        userOtpCode: { create: { userId: user.id } },
      },
    });

    await sendOtp({ code, to: user.phoneNumber });

    await db.userLog.create({
      data: { userId: user.id, action: "login" },
    });

    return c.json(
      { success: true, message: null, result: { otp: { key: otpCode.key } } },
      { status: 201 },
    );
  },
);

app.post(
  "/register",
  zValidator("json", routerSchema.register, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("json");
    const duplicate = await db.user.findUnique({
      where: { username: input.phoneNumber },
    });

    if (duplicate) {
      return c.json(
        {
          success: false,
          message: "Phone number already registered",
          result: null,
        },
        { status: 400 },
      );
    }

    const user = await db.user.create({
      data: {
        username: input.phoneNumber,
        phoneNumber: input.phoneNumber,
        password: await bcrypt.hash(input.pin, 10),
        name: `USER-${randomString(8, { characters: CHARACTERS.ALPHANUMERIC }).toUpperCase()}`,
      },
    });

    const code = randomString(6, { characters: CHARACTERS.NUMERIC });

    const otpCode = await db.otpCode.create({
      data: {
        key: randomString(),
        purpose: "register",
        secret: await bcrypt.hash(code, 10),
        expiredAt: addMinutes(new Date(), 30),
        userOtpCode: { create: { userId: user.id } },
      },
    });

    await sendOtp({ code, to: user.phoneNumber });

    await db.userLog.create({
      data: { userId: user.id, action: "register" },
    });

    return c.json(
      { success: true, message: null, result: { otp: { key: otpCode.key } } },
      { status: 201 },
    );
  },
);

app.post(
  "/otp",
  zValidator("json", routerSchema.otp, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("json");
    const otpCode = await db.otpCode.findUnique({
      where: { key: input.key },
      include: {
        userOtpCode: { include: { user: { omit: { password: true } } } },
      },
    });

    if (!otpCode) {
      return c.json(
        { success: false, message: "OTP code not found", result: null },
        { status: 404 },
      );
    }

    if (otpCode.status === "used") {
      return c.json(
        { success: false, message: "OTP code already used", result: null },
        { status: 400 },
      );
    }

    if (isAfter(new Date(), otpCode.expiredAt)) {
      return c.json(
        { success: false, message: "OTP code expired", result: null },
        { status: 400 },
      );
    }

    if (["login", "register"].includes(otpCode.purpose)) {
      const user = await db.user.findFirst({
        where: { userOtpCodes: { some: { otpCode: { id: otpCode.id } } } },
      });

      if (!user) {
        return c.json(
          { success: false, message: "User not found", result: null },
          { status: 404 },
        );
      }

      if (user.verifiedAt && otpCode.purpose === "register") {
        return c.json(
          { success: false, message: "User already verified", result: null },
          { status: 400 },
        );
      }

      let token: string | null = null;
      const verified = await bcrypt.compare(input.code, otpCode.secret);

      if (verified) {
        await db.otpCode.update({
          data: { status: "used" },
          where: { id: otpCode.id },
        });

        if (otpCode.purpose === "register") {
          await db.user.update({
            where: { id: user.id },
            data: { verifiedAt: new Date() },
          });
        }

        if (otpCode.purpose === "login") {
          const key = randomString(12);
          token = jwt.sign({ key }, env.JWT_SECRET);

          await db.token.create({
            data: {
              key,
              abilities: ["user"],
              secret: await bcrypt.hash(token, 10),
              userToken: { create: { userId: user.id } },
            },
          });
        }
      }

      return c.json(
        {
          success: verified,
          message: verified ? null : "Invalid OTP code",
          result: token ? { verified, token } : { verified },
        },
        { status: verified ? 200 : 400 },
      );
    }

    return c.json(
      { success: false, message: null, result: null },
      { status: 400 },
    );
  },
);

export default app;
