import type { Prisma } from "@prisma/client";
import {
  DATE_FORMAT,
  type Locale,
  TOKEN_STATUSES,
  TOKEN_STATUS_MAP,
  type Timezone,
  USER_ACCOUNT_TYPES,
  USER_ACCOUNT_TYPE_MAP,
  USER_PASSWORD_RESET_SESSION_ACTIONS,
  USER_PASSWORD_RESET_SESSION_ACTION_MAP,
  USER_PASSWORD_RESET_SESSION_STATUSES,
  USER_PASSWORD_RESET_SESSION_STATUS_MAP,
  USER_STATUSES,
  USER_STATUS_MAP,
  USER_TYPES,
  USER_TYPE_MAP,
  formatDate,
} from "@repo/common";
import { z } from "zod";

export type UserRecord = ReturnType<typeof parseUser>;

export function parseUser({
  user,
  locale,
  timezone,
  defaultValue,
}: {
  locale: Locale;
  timezone: Timezone;
  defaultValue: { image: string };
  user: Prisma.UserGetPayload<{ include: { userAccounts: true } }>;
}) {
  const detail = parseUserDetail({ user, locale, timezone, defaultValue });

  return {
    id: detail.id,
    name: detail.name,
    phoneNumber: detail.phoneNumber,
    email: detail.email,
    status: detail.status,
    type: detail.type,
    username: detail.username,
    password: detail.password,
    image: detail.image,
    verifiedAt: detail.verifiedAt,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    fmt: detail.fmt,
    accounts: user.userAccounts.map((userAccount) => {
      return parseUserAccount({ userAccount, locale, timezone });
    }),
  };
}

export function parseUserDetail({
  user,
  locale,
  timezone,
  defaultValue,
}: {
  locale: Locale;
  timezone: Timezone;
  defaultValue: { image: string };
  user: Prisma.UserGetPayload<object>;
}) {
  return {
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    status: z.enum(USER_STATUSES).parse(user.status),
    type: z.enum(USER_TYPES).parse(user.type),
    username: user.username,
    password: user.password,
    image: user.image,
    verifiedAt: user.verifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fmt: {
      status: USER_STATUS_MAP[user.status],
      type: USER_TYPE_MAP[user.type],
      image: user.image ?? defaultValue.image,
      verifiedAt: user.verifiedAt
        ? formatDate(user.verifiedAt, DATE_FORMAT.NORMAL, locale, timezone)
        : "-",
      createdAt: formatDate(
        user.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        user.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseUserAccount({
  locale,
  timezone,
  userAccount,
}: {
  locale: Locale;
  timezone: Timezone;
  userAccount: Prisma.UserAccountGetPayload<object>;
}) {
  return {
    id: userAccount.id,
    type: z.enum(USER_ACCOUNT_TYPES).parse(userAccount.type),
    createdAt: userAccount.createdAt,
    updatedAt: userAccount.updatedAt,
    fmt: {
      type: USER_ACCOUNT_TYPE_MAP[userAccount.type],
      createdAt: formatDate(
        userAccount.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        userAccount.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export type TokenRecord = ReturnType<typeof parseToken>;

export function parseToken({
  token,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  token: Prisma.TokenGetPayload<object>;
}) {
  return {
    id: token.id,
    key: token.key,
    status: z.enum(TOKEN_STATUSES).parse(token.status),
    secret: token.secret,
    abilities: z.string().array().safeParse(token.abilities)?.data ?? [],
    expiredAt: token.expiredAt,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
    fmt: {
      status: TOKEN_STATUS_MAP[token.status],
      expiredAt: token.expiredAt
        ? formatDate(token.expiredAt, DATE_FORMAT.NORMAL, locale, timezone)
        : "-",
      createdAt: formatDate(
        token.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        token.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}

export function parseUserPasswordResetSession({
  userPasswordResetSession,
  locale,
  timezone,
}: {
  locale: Locale;
  timezone: Timezone;
  userPasswordResetSession: Prisma.UserPasswordResetSessionGetPayload<object>;
}) {
  return {
    id: userPasswordResetSession.id,
    key: userPasswordResetSession.key,
    action: z
      .enum(USER_PASSWORD_RESET_SESSION_ACTIONS)
      .parse(userPasswordResetSession.action),
    status: z
      .enum(USER_PASSWORD_RESET_SESSION_STATUSES)
      .parse(userPasswordResetSession.status),
    expiredAt: userPasswordResetSession.expiredAt,
    createdAt: userPasswordResetSession.createdAt,
    updatedAt: userPasswordResetSession.updatedAt,
    fmt: {
      action:
        USER_PASSWORD_RESET_SESSION_ACTION_MAP[userPasswordResetSession.action],
      status:
        USER_PASSWORD_RESET_SESSION_STATUS_MAP[userPasswordResetSession.status],
      expiredAt: formatDate(
        userPasswordResetSession.expiredAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      createdAt: formatDate(
        userPasswordResetSession.createdAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
      updatedAt: formatDate(
        userPasswordResetSession.updatedAt,
        DATE_FORMAT.NORMAL,
        locale,
        timezone,
      ),
    },
  };
}
