import type { Currency, Locale, Timezone } from "@repo/common";
import type { parseToken } from "@repo/database";
import type { serializeUser } from "~/lib/serializer";

export type Env = {
  Variables: {
    locale: Locale;
    currency: Currency;
    timezone: Timezone;
    token?: ReturnType<typeof parseToken> | null;
    user?: ReturnType<typeof serializeUser> | null;
  };
};
