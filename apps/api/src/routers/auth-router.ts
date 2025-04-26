import { zValidator } from "@hono/zod-validator";
import { CHARACTERS, randomString } from "@repo/common";
import { apiRouterSchema as routerSchema } from "@repo/common/schemas/auth-schema";
import { parseToken, parseUserPasswordResetSession } from "@repo/database";
import bcrypt from "bcryptjs";
import { addMinutes, addMonths, isAfter } from "date-fns";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { env } from "~/env";
import { db } from "~/lib/db";
import { decrypt, encrypt } from "~/lib/encryption";
import { sendOtp } from "~/lib/meta";
import { protect, zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import type { Env } from "~/types";

const app = new Hono<Env>();

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
        userAccounts: { create: { type: "shohibul_qurban" } },
        name: `USER-${randomString(8, { characters: CHARACTERS.ALPHANUMERIC }).toUpperCase()}`,
      },
    });

    const code = randomString(6, { characters: CHARACTERS.NUMERIC });

    const otpCode = await db.otpCode.create({
      data: {
        action: "register",
        key: randomString(),
        secret: await encrypt(code),
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
        action: "login",
        key: randomString(),
        secret: await encrypt(code),
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

app.use("/logout", protect).post("/logout", async (c) => {
  const user = c.var.user;
  const token = c.var.token;

  if (!user || !token) {
    return c.json(
      { success: false, message: "Unauthorized", result: null },
      { status: 401 },
    );
  }

  await db.token.update({
    data: { status: "inactive" },
    where: { id: token.id, userToken: { userId: user.id } },
  });

  return c.json(
    { success: true, message: "Logout success", result: null },
    { status: 200 },
  );
});

app.post(
  "/forgot-password",
  zValidator("json", routerSchema.forgotPassword, zodValidatorMiddleware),
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

    const code = randomString(6, { characters: CHARACTERS.NUMERIC });

    const otpCode = await db.otpCode.create({
      data: {
        key: randomString(),
        action: "forgot_password",
        secret: await encrypt(code),
        expiredAt: addMinutes(new Date(), 30),
        userOtpCode: { create: { userId: user.id } },
      },
    });

    await sendOtp({ code, to: user.phoneNumber });

    await db.userLog.create({
      data: { userId: user.id, action: "forgot_password" },
    });

    return c.json(
      { success: true, message: null, result: { otp: { key: otpCode.key } } },
      { status: 201 },
    );
  },
);

app.post(
  "/reset-password",
  zValidator("json", routerSchema.resetPassword, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("json");
    const session = await db.userPasswordResetSession.findUnique({
      include: { user: true },
      where: { key: input.key },
    });

    if (!session) {
      return c.json(
        {
          success: false,
          message: "Password reset session not found",
          result: null,
        },
        { status: 404 },
      );
    }

    if (session.status === "inactive") {
      return c.json(
        {
          success: false,
          message: "Password reset session inactive",
          result: null,
        },
        { status: 400 },
      );
    }

    if (isAfter(new Date(), session.expiredAt)) {
      return c.json(
        {
          success: false,
          message: "Password reset session expired",
          result: null,
        },
        { status: 400 },
      );
    }

    await db.userPasswordResetSession.update({
      where: { id: session.id },
      data: { status: "inactive" },
    });

    await db.user.update({
      where: { id: session.userId },
      data: { password: await bcrypt.hash(input.pin, 10) },
    });

    return c.json(
      { success: true, message: "Reset PIN success", result: null },
      { status: 200 },
    );
  },
);

app
  .use("/change-password", protect)
  .post(
    "/change-password",
    zValidator("json", routerSchema.changePassword, zodValidatorMiddleware),
    async (c) => {
      const user = c.var.user;
      const input = c.req.valid("json");

      if (!user) {
        return c.json(
          { success: false, message: "Unauthorized", result: null },
          { status: 401 },
        );
      }

      if (user.status !== "active") {
        return c.json(
          { success: false, message: "User status inactive", result: null },
          { status: 400 },
        );
      }

      if (!user.verifiedAt) {
        return c.json(
          { success: false, message: "User not verified", result: null },
          { status: 400 },
        );
      }

      const verified = await bcrypt.compare(input.oldPin, user.password);

      if (!verified) {
        return c.json(
          { success: false, message: "Invalid old PIN", result: null },
          { status: 400 },
        );
      }

      if (input.oldPin === input.newPin) {
        return c.json(
          {
            success: false,
            message: "New PIN must be different from old PIN",
            result: null,
          },
          { status: 400 },
        );
      }

      await db.user.update({
        where: { id: user.id },
        data: { password: await bcrypt.hash(input.newPin, 10) },
      });

      await db.userLog.create({
        data: { userId: user.id, action: "change_password" },
      });

      return c.json(
        { success: true, message: "Change PIN success", result: null },
        { status: 200 },
      );
    },
  );

app.post(
  "/otp",
  zValidator("json", routerSchema.verifyOtp, zodValidatorMiddleware),
  async (c) => {
    const locale = c.var.locale;
    const timezone = c.var.timezone;
    const input = c.req.valid("json");

    const otpCode = await db.otpCode.findUnique({
      where: { key: input.key },
      include: { userOtpCode: { include: { user: true } } },
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

    const user = otpCode?.userOtpCode?.user ?? null;

    if (!user) {
      return c.json(
        { success: false, message: "User not found", result: null },
        { status: 404 },
      );
    }

    if (user.verifiedAt && otpCode.action === "register") {
      return c.json(
        { success: false, message: "User already verified", result: null },
        { status: 400 },
      );
    }

    const verified = (await decrypt(otpCode.secret)) === input.code;

    if (!verified) {
      return c.json(
        { success: false, message: "Invalid OTP code", result: { verified } },
        { status: 400 },
      );
    }

    await db.otpCode.update({
      data: { status: "used" },
      where: { id: otpCode.id },
    });

    if (
      otpCode.action === "register" ||
      (otpCode.action === "login" && !user.verifiedAt)
    ) {
      await db.user.update({
        where: { id: user.id },
        data: { verifiedAt: new Date() },
      });
    }

    if (otpCode.action === "login") {
      const key = randomString(12);
      const secret = jwt.sign({ key }, env.JWT_SECRET);

      const token = parseToken({
        locale,
        timezone,
        token: await db.token.create({
          data: {
            key,
            abilities: [],
            expiredAt: addMonths(new Date(), 1),
            secret: await bcrypt.hash(secret, 10),
            userToken: { create: { userId: user.id } },
          },
        }),
      });

      return c.json(
        {
          success: true,
          message: null,
          result: transformRecord({
            verified,
            token: {
              secret,
              expiredAt: token.expiredAt,
              fmt: { expiredAt: token.fmt.expiredAt },
            },
          }),
        },
        { status: 201 },
      );
    }

    if (otpCode.action === "forgot_password") {
      const session = parseUserPasswordResetSession({
        locale,
        timezone,
        userPasswordResetSession: await db.userPasswordResetSession.create({
          data: {
            userId: user.id,
            key: randomString(),
            action: "forgot_password",
            expiredAt: addMinutes(new Date(), 30),
          },
        }),
      });

      return c.json(
        {
          success: true,
          message: null,
          result: transformRecord({
            verified,
            session: {
              key: session.key,
              expiredAt: session.expiredAt,
              fmt: { expiredAt: session.fmt.expiredAt },
            },
          }),
        },
        { status: 201 },
      );
    }

    return c.json(
      { success: true, message: null, result: { verified } },
      { status: 200 },
    );
  },
);

app.post(
  "/otp/resend",
  zValidator("json", routerSchema.resendOtp, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("json");
    const otpCode = await db.otpCode.findUnique({
      where: { key: input.key },
      include: { userOtpCode: { include: { user: true } } },
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

    const user = otpCode?.userOtpCode?.user ?? null;

    if (!user) {
      return c.json(
        { success: false, message: "User not found", result: null },
        { status: 404 },
      );
    }

    await sendOtp({
      to: user.phoneNumber,
      code: await decrypt(otpCode.secret),
    });

    await db.otpCode.update({
      where: { id: otpCode.id },
      data: { expiredAt: addMinutes(new Date(), 30) },
    });

    return c.json(
      { success: true, message: "OTP code resent", result: null },
      { status: 200 },
    );
  },
);

export default app;
