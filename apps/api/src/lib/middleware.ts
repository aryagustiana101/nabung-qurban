import type { Optional } from "@repo/common/types";
import { parseToken, parseUser } from "@repo/database";
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

  const token = _token
    ? parseToken({
        token: _token,
        timezone: env.APP_TZ,
        locale: env.APP_LOCALE,
      })
    : null;

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
    include: { userAccounts: true },
    where: { userTokens: { some: { tokenId: token.id } } },
  });

  const user = _user
    ? parseUser({
        user: _user,
        timezone: env.APP_TZ,
        locale: env.APP_LOCALE,
        defaultValue: { image: getPublicUrl("static/avatar.png") },
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
