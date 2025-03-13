import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", override: true });

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    APP_TZ: z.enum(["UTC", "Asia/Jakarta"]),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_BUCKET: z.string().min(1),
    AWS_DEFAULT_REGION: z.string().min(1),
    AWS_ENDPOINT_URL: z.string().url(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    PORT: z
      .string()
      .min(1)
      .refine((value) => z.number().min(1).safeParse(Number(value)).success)
      .transform((value) => Number(value)),
  },
});
