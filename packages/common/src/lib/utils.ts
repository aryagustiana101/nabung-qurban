import { TZDate } from "@date-fns/tz";
import { DATE_FORMAT } from "@repo/common/lib/constants";
import type {
  Currency,
  Locale,
  PaginationType,
  RouteParams,
  Timezone,
} from "@repo/common/types";
import * as changeCase from "change-case";
import { format as _formatDate, parse as _parseDate } from "date-fns";
import {
  enUS as dateFnsLocaleEn,
  id as dateFnsLocaleId,
} from "date-fns/locale";
import { customAlphabet, nanoid } from "nanoid";
import { match } from "path-to-regexp";
import queryString, { type IParseOptions, type IStringifyOptions } from "qs";
import { objectToCamel, objectToSnake } from "ts-case-convert";

export function formatDate(
  value: Date,
  format: string,
  locale: "en" | "id",
  timezone: Timezone,
  opts?: Parameters<typeof _formatDate>["2"],
) {
  return _formatDate(new TZDate(value, timezone), format, {
    ...(opts ?? {}),
    locale: { en: dateFnsLocaleEn, id: dateFnsLocaleId }?.[locale],
  });
}

export function parseDate(
  value: string | Date,
  format?: string,
  timezone?: Timezone,
  opts?: Parameters<typeof _parseDate>["3"],
) {
  if (typeof value === "string" && !format) {
    throw new Error("Format is required");
  }

  return new TZDate(
    typeof value === "string"
      ? _parseDate(value, format ?? DATE_FORMAT.PARAMS, new Date(), opts)
      : value,
    timezone,
  );
}

export function formatMoney(
  value: number,
  opts?: {
    currency?: Currency;
    maximumFractionDigits?: number;
  },
) {
  const currency = opts?.currency ?? "idr";
  const maximumFractionDigits = opts?.maximumFractionDigits ?? 0;

  return new Intl.NumberFormat({ idr: "id-ID", usd: "en-US" }[currency], {
    currency,
    style: "currency",
    maximumFractionDigits,
  }).format(value);
}

export function randomString(length = 21, opts?: { characters?: string }) {
  return opts?.characters
    ? customAlphabet(opts.characters, length)()
    : nanoid(length);
}

export function computePagination({
  type,
  page,
  prev,
  next,
  count,
  limit,
  cursor,
}: {
  limit: number;
  count: number;
  page?: number | null;
  prev?: number | null;
  next?: number | null;
  type: PaginationType;
  cursor?: number | null;
}) {
  return {
    type,
    recordCount: count,
    offset:
      type === "offset"
        ? { page: page ?? null, pageCount: Math.ceil(count / limit) }
        : null,
    cursor:
      type === "cursor"
        ? { index: cursor ?? null, prev: prev ?? null, next: next ?? null }
        : null,
  };
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat({ id: "id-ID", en: "en-US" }[locale], {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

export function computeDiscount({
  price,
  discount,
}: {
  price: number;
  discount: { value: number; type: "percentage" | "flat" } | null;
}) {
  const value = discount
    ? discount.type === "percentage"
      ? price * (discount.value / 100)
      : discount.type === "flat"
        ? discount.value
        : 0
    : 0;

  const final = price - value;
  const percentage = Math.round((value / price) * 100);

  return {
    cut: {
      value,
      percentage,
      fmt: { value: formatMoney(value), percentage: `${percentage}%` },
    },
    price: {
      original: price,
      final,
      fmt: { original: formatMoney(price), final: formatMoney(final) },
    },
  };
}

export function transformRecord<T extends object>(
  record: T,
  format?: "snake",
): ReturnType<typeof objectToSnake<T>>;
export function transformRecord<T extends object>(
  record: T,
  format?: "camel",
): ReturnType<typeof objectToCamel<T>>;
export function transformRecord<T extends object>(
  record: T,
  format: "snake" | "camel" = "snake",
) {
  if (format === "camel") {
    return objectToCamel<T>(record);
  }

  return objectToSnake<T>(record);
}

export function routeParams<Path extends string>(path: Path, route: string) {
  const result = match<RouteParams<Path>>(path)(route);

  return Object.entries(result ? (result?.params ?? {}) : {}).reduce(
    (acc, [key, value]) => ({ ...(acc ?? {}), [key]: value }),
    {} as Record<string, string | string[]>,
  ) as RouteParams<Path>;
}

export function getInitial(value: string) {
  const chars = value.trim().split(" ") ?? [];

  return chars
    ?.reduce((acc, curr, i) => {
      return i === 0 || i === chars.length - 1
        ? `${acc}${curr.charAt(0).toUpperCase()}`
        : acc;
    }, "")
    .replaceAll(/[^a-zA-Z]/g, "");
}

export function convertCase(
  value: string,
  format: "capitalCase" | "sentenceCase" | "snakeCase" = "capitalCase",
) {
  return changeCase[format](value);
}

export const qs = {
  stringify: (value: Record<string, unknown>, options?: IStringifyOptions) =>
    queryString.stringify(value, { encodeValuesOnly: true, ...options }),
  parse: (value: string | Record<string, string>, options?: IParseOptions) =>
    queryString.parse(value, options),
};

export function transformIndonesiaPhoneNumber(value: string) {
  return (value.startsWith("08") ? value.replace("08", "628") : value)
    .replaceAll(" ", "")
    .replaceAll("+", "")
    .replace(/\D/g, "");
}

export function isPhoneNumberLocaleIndonesia(value: string) {
  return value ? ["62", "08"].includes(value.slice(0, 2)) : true;
}
