import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "production"])
      .default("development"),
    NEXT_PUBLIC_APP_LOCALE: z.enum(["en", "id"]).default("en"),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_TZ: z.enum(["UTC", "Asia/Jakarta"]),
  },
  server: {
    DATABASE_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_LOCALE: process.env.NEXT_PUBLIC_APP,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_TZ: process.env.NEXT_PUBLIC_APP_TZ,
  },
});
