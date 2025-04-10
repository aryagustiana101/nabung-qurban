import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

export const env = createEnv({
  runtimeEnv: dotenv.config({ path: ".env", override: true }).parsed ?? {},
  server: {
    APP_ENV: z.enum(["development", "production"]).default("development"),
    APP_LOCALE: z.enum(["en", "id"]).default("en"),
    APP_TZ: z.enum(["UTC", "Asia/Jakarta"]),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_BUCKET: z.string().min(1),
    AWS_DEFAULT_REGION: z.string().min(1),
    AWS_ENDPOINT_URL: z.string().url(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
    ENCRYPTION_SECRET_KEY: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    META_API_TOKEN: z.string().min(1),
    META_API_URL: z.string().url(),
    META_API_VERSION: z.string().min(1),
    PORT: z
      .string()
      .min(1)
      .refine((value) => z.number().min(1).safeParse(Number(value)).success)
      .transform((value) => Number(value)),
    WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_COMPONENTS: z.string().min(1),
    WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_LANGUAGE: z.string().min(1),
    WHATSAPP_BUSINESS_OTP_MESSAGE_TEMPLATE_NAME: z.string().min(1),
    WHATSAPP_BUSINESS_PHONE_NUMBER_ID: z.string().min(1),
  },
});
