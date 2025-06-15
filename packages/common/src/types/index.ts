import type {
  CURRENCIES,
  LOCALES,
  PAGINATION_TYPES,
  TIMEZONES,
} from "@repo/common/lib/constants";
import type {
  PRODUCT_ATTRIBUTE_KEYS,
  PRODUCT_SCOPES,
} from "@repo/common/lib/options";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Needed<T, K extends keyof T> = Pick<Required<T>, K>;

export type Timezone = (typeof TIMEZONES)[number];

export type Locale = (typeof LOCALES)[number];

export type Currency = (typeof CURRENCIES)[number];

export type ProductScope = (typeof PRODUCT_SCOPES)[number];

export type ProductAttributeKey = (typeof PRODUCT_ATTRIBUTE_KEYS)[number];

export type PaginationType = (typeof PAGINATION_TYPES)[number];

export type RemoveBraces<T extends string> =
  T extends `${infer Name}{${infer _}}`
    ? Name
    : T extends `${infer Name}{`
      ? Name
      : T extends `${infer Name}}`
        ? Name
        : T;

export type RouteParams<Path extends string> = Path extends `/*${infer Rest}`
  ? { [K in Rest]: string[] }
  : Path extends `/:${infer Param}/${infer Rest}`
    ? { [K in RemoveBraces<Param>]: string } & RouteParams<`/${Rest}`>
    : Path extends `/:${infer Param}`
      ? { [K in RemoveBraces<Param>]: string }
      : // biome-ignore lint/complexity/noBannedTypes: Empty object needed
        {};
