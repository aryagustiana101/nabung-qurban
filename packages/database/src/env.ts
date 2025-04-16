import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", override: true });

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    DATABASE_URL: z.string().url(),
    DB_SEED_ROOT_PASSWORD: z.string().min(1),
    DB_SEED_USER_ADDRESS: z.string().min(1),
    DB_SEED_USER_NAME: z.string().min(1),
    DB_SEED_USER_EMAIL: z.string().email(),
    DB_SEED_USER_PASSWORD: z.string().min(1),
    DB_SEED_USER_PHONE_NUMBER: z.string().min(1),
    DB_SEED_USER_USERNAME: z.string().min(1),
    DB_SEED_USER_TOKEN_KEY: z.string().min(1),
    DB_SEED_USER_TOKEN_SECRET: z.string().min(1),
  },
});
