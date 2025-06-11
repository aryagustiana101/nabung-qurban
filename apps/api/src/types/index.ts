import type { Currency, Locale, Timezone } from "@repo/common";
import type { parseToken, serializeUser } from "@repo/database";

export type Env = {
  Variables: {
    locale: Locale;
    currency: Currency;
    timezone: Timezone;
    token?: ReturnType<typeof parseToken> | null;
    user?: ReturnType<typeof serializeUser> | null;
  };
};
