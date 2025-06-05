export const APP_ENVIRONMENTS = ["development", "production"] as const;

export const DATE_FORMAT = {
  INPUT: "yyyy-MM-dd",
  PARAMS: "dd-MM-yyyy",
  NORMAL: "dd MMMM yyyy HH:mm:ss",
  FULL: "EEEE, dd MMMM yyyy HH:mm:ss",
} as const;

export const CHARACTERS = {
  ALPHA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  NUMERIC: "0123456789",
  ALPHANUMERIC:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
};

export const LOCALES = ["en", "id"] as const;

export const TIMEZONES = ["UTC", "Asia/Jakarta"] as const;

export const CURRENCIES = ["idr", "usd"] as const;

export const PAGINATION_TYPES = ["cursor", "offset"] as const;
