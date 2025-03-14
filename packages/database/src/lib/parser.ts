import type { Prisma } from "@prisma/client";
import {
  DATE_FORMAT,
  type Locale,
  type Timezone,
  USER_ACCOUNT_TYPES,
  USER_ACCOUNT_TYPE_MAP,
  USER_STATUSES,
  USER_STATUS_MAP,
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
    email: detail.email,
    phoneNumber: detail.phoneNumber,
    status: detail.status,
    username: detail.username,
    password: detail.password,
    image: detail.image,
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
    email: user.email,
    phoneNumber: user.phoneNumber,
    status: z.enum(USER_STATUSES).parse(user.status),
    username: user.username,
    password: user.password,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fmt: {
      status: USER_STATUS_MAP[user.status],
      image: user.image ?? defaultValue.image,
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
    secret: token.secret,
    abilities: z.string().array().safeParse(token.abilities)?.data ?? [],
    expiredAt: token.expiredAt,
    createdAt: token.createdAt,
    updatedAt: token.updatedAt,
    fmt: {
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
