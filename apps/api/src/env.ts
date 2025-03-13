import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", override: true });

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    APP_TZ: z.enum(["UTC", "Asia/Jakarta"]),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    PORT: z
      .string()
      .min(1)
      .refine((value) => z.number().min(1).safeParse(Number(value)).success)
      .transform((value) => Number(value)),
  },
});
