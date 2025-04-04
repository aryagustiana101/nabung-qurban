import type { Currency, Locale, Timezone } from "@repo/common";
import type { TokenRecord, UserRecord } from "~/lib/parser";

export type Env = {
  Variables: {
    locale: Locale;
    currency: Currency;
    timezone: Timezone;
    user?: UserRecord | null;
    token?: TokenRecord | null;
  };
};
