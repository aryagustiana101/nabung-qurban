import {
  formatDate as _formatDate,
  formatMoney as _formatMoney,
  parseDate as _parseDate,
} from "@repo/common";
import { objectToSnake } from "ts-case-convert";
import { env } from "~/env";

type FormatDateParams = Parameters<typeof _formatDate>;

export function formatDate(
  value: FormatDateParams["0"],
  format: FormatDateParams["1"],
  locale: FormatDateParams["2"] = "en",
  timezone: FormatDateParams["3"] = env.APP_TZ,
  opts?: FormatDateParams["4"],
) {
  return _formatDate(value, format, locale, timezone, opts);
}

type ParseDateParams = Parameters<typeof _parseDate>;

export function parseDate(
  value: ParseDateParams["0"],
  format?: ParseDateParams["1"],
  timezone: ParseDateParams["2"] = env.APP_TZ,
  opts?: ParseDateParams["3"],
) {
  return _parseDate(value, format, timezone, opts);
}

type FormatMoneyParams = Parameters<typeof _formatMoney>;

export function formatMoney(
  value: FormatMoneyParams["0"],
  opts?: FormatMoneyParams["1"],
) {
  return _formatMoney(value, opts);
}

export function transformRecord<T extends object>(record: T) {
  return objectToSnake<T>(record);
}
