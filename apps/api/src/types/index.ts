import type { TokenRecord, UserRecord } from "@repo/database";

export type Env = {
  Variables: { token?: TokenRecord | null; user?: UserRecord | null };
};
