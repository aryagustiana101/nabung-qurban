import type {
  CURRENCIES,
  LOCALES,
  TIMEZONES,
} from "@repo/common/lib/constants";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Needed<T, K extends keyof T> = Pick<Required<T>, K>;

export type Timezone = (typeof TIMEZONES)[number];

export type Locale = (typeof LOCALES)[number];

export type Currency = (typeof CURRENCIES)[number];
