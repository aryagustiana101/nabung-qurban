import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_CURRENCY: z.enum(["idr"]).default("idr"),
    NEXT_PUBLIC_APP_ENV: z
      .enum(["development", "production"])
      .default("development"),
    NEXT_PUBLIC_APP_LOCALE: z.enum(["en", "id"]).default("en"),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_TZ: z.enum(["UTC", "Asia/Jakarta"]),
  },
  server: {
    AUTH_COOKIE_PREFIX: z.string().trim().min(1),
    AUTH_SECRET: z.string().trim().min(1),
    AUTH_TRUST_HOST: z
      .string()
      .transform((value) => value.toLowerCase() === "true"),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_BUCKET: z.string().min(1),
    AWS_DEFAULT_REGION: z.string().min(1),
    AWS_ENDPOINT_URL: z.string().url(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
    DISABLE_IMAGE_OPTIMIZATION: z
      .string()
      .min(1)
      .transform((value) => value.toLowerCase() === "true"),
  },
  runtimeEnv: {
    AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DISABLE_IMAGE_OPTIMIZATION: process.env.DISABLE_IMAGE_OPTIMIZATION,
    NEXT_PUBLIC_APP_CURRENCY: process.env.NEXT_PUBLIC_APP_CURRENCY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_LOCALE: process.env.NEXT_PUBLIC_APP,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_TZ: process.env.NEXT_PUBLIC_APP_TZ,
  },
});
