import { createEnv } from "@t3-oss/env-core";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", override: true });

export const env = createEnv({
  runtimeEnv: process.env,
  server: {
    DATABASE_URL: z.string().url(),
  },
});
