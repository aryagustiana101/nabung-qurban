import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { getPublicUrl, getUploadPresignedUrl } from "~/lib/storage";
import { routerSchema } from "~/schemas/storage-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get(
  "/",
  zValidator("query", routerSchema.get, zodValidatorMiddleware),
  async (c) => {
    const input = c.req.valid("query");
    const file = `upload/${nanoid()}.${input.file.match(/\.(\w+)$/)?.[1] ?? "png"}`;

    const upload = await getUploadPresignedUrl(file, {
      expires: input.expires,
    });

    return c.json(
      {
        success: true,
        message: null,
        result: { upload, public: getPublicUrl(file) },
      },
      { status: 200 },
    );
  },
);

export default app;
