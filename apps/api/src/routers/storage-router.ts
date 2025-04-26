import { zValidator } from "@hono/zod-validator";
import { randomString } from "@repo/common";
import { Hono } from "hono";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { getPublicUrl, getUploadPresignedUrl } from "~/lib/storage";
import { routerSchema } from "~/schemas/storage-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get(
  "/",
  zValidator("query", routerSchema.getPresignedUrl, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("query");
    const file = `upload/${randomString()}.${input.file.match(/\.(\w+)$/)?.[1] ?? "png"}`;

    return c.json(
      {
        success: true,
        message: null,
        result: {
          public: getPublicUrl(file),
          upload: await getUploadPresignedUrl(file, { expires: input.expires }),
        },
      },
      { status: 200 },
    );
  },
);

export default app;
