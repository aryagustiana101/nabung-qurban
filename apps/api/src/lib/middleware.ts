import type { Optional } from "@repo/common";
import { parseToken, serializeUser } from "@repo/database";
import bcrypt from "bcryptjs";
import { isAfter } from "date-fns";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { type SafeParseReturnType, z } from "zod";
import { env } from "~/env";
import { db } from "~/lib/db";
import { getPublicUrl } from "~/lib/storage";
import type { Env } from "~/types";

export function zodValidatorMiddleware<T, U>(
  output: Optional<SafeParseReturnType<T, U>, "error">,
  c: Context,
) {
  if (!output.success) {
    return c.json(
      {
        success: false,
        message: output?.error?.issues?.[0]?.message ?? null,
        result: null,
      },
      { status: 400 },
    );
  }
}

export const protect = createMiddleware<Env>(async (c, next) => {
  const locale = c.var.locale;
  const timezone = c.var.timezone;
  const note = c.req.header("Authorization")?.split("Bearer ")?.at(1);

  if (!note) {
    return c.json(
      { success: false, message: "Missing authorization token", result: null },
      { status: 401 },
    );
  }

  const payload = (() => {
    try {
      return (
        z
          .object({ key: z.string() })
          .safeParse(jwt.verify(note, env.JWT_SECRET)).data ?? null
      );
    } catch (_) {
      return null;
    }
  })();

  const _token = payload?.key
    ? await db.token.findUnique({ where: { key: payload.key } })
    : null;

  const token = _token ? parseToken({ locale, timezone, token: _token }) : null;

  if (!token) {
    return c.json(
      { success: false, message: "Token not found", result: null },
      { status: 404 },
    );
  }

  const verified = await bcrypt.compare(note, token.secret);

  if (!verified) {
    return c.json(
      { success: false, message: "Token invalid", result: null },
      { status: 401 },
    );
  }

  if (token.expiredAt && isAfter(new Date(), token.expiredAt)) {
    return c.json(
      { success: false, message: "Token expired", result: null },
      { status: 401 },
    );
  }

  if (token.status !== "active") {
    return c.json(
      { success: false, message: "Token inactive", result: null },
      { status: 401 },
    );
  }

  const _user = await db.user.findFirst({
    where: { userTokens: { some: { tokenId: token.id } } },
    include: {
      userAccounts: {
        include: {
          userAccountReferrals: true,
          userAccountApplication: { include: { userApplication: true } },
        },
      },
    },
  });

  const user = _user
    ? serializeUser({
        locale,
        timezone,
        record: _user,
        publicUrl: env.WEB_PUBLIC_URL,
        defaultValue: { image: getPublicUrl("/static/avatar.png") },
      })
    : null;

  if (!user) {
    return c.json(
      { success: false, message: "User not found", result: null },
      { status: 404 },
    );
  }

  c.set("token", token);
  c.set("user", user);

  await next();
});

export const context = createMiddleware<Env>(async (c, next) => {
  c.set("currency", env.APP_CURRENCY);
  c.set("timezone", env.APP_TZ);
  c.set("locale", env.APP_LOCALE);

  await next();
});
