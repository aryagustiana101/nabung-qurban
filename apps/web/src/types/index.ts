import type { parseUser } from "@repo/database";

export type User = Omit<ReturnType<typeof parseUser>, "password">;

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
