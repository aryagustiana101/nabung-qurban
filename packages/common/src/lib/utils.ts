import { TZDate } from "@date-fns/tz";
import { DATE_FORMAT } from "@repo/common/lib/constants";
import type { Currency, Timezone } from "@repo/common/types";
import { format as _formatDate, parse as _parseDate } from "date-fns";
import {
  enUS as dateFnsLocaleEn,
  id as dateFnsLocaleId,
} from "date-fns/locale";
import { customAlphabet, nanoid } from "nanoid";

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
  limit,
  count,
}: {
  page?: number;
  limit: number;
  count: number;
  cursor?: number;
  type: "offset" | "cursor";
}) {
  return {
    type,
    recordCount: count,
    offset: { page, pageCount: Math.ceil(count / limit) },
    cursor: null,
  };
}
