import type { Currency, Locale, Timezone } from "@repo/common";
import type { parseToken } from "@repo/database";
import type { UserRecord } from "~/lib/parser";

export type Env = {
  Variables: {
    locale: Locale;
    currency: Currency;
    timezone: Timezone;
    user?: UserRecord | null;
    token?: ReturnType<typeof parseToken> | null;
  };
};
