import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { db } from "~/lib/db";
import { zodValidatorMiddleware } from "~/lib/middleware";
import { transformRecord } from "~/lib/utils";
import { routerSchema } from "~/schemas/profile-schema";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get("/", async (c) => {
  const user = c.var.user;

  if (!user) {
    return c.json(
      { success: false, message: "Unauthorized", result: null },
      { status: 401 },
    );
  }

  return c.json(
    {
      success: true,
      message: null,
      result: transformRecord({ ...user, password: undefined }),
    },
    { status: 200 },
  );
});

app.put(
  "/",
  zValidator("json", routerSchema.update, zodValidatorMiddleware),
  async (c) => {
    const user = c.var.user;
    const input = c.req.valid("json");

    if (!user) {
      return c.json(
        { success: false, message: "Unauthorized", result: null },
        { status: 401 },
      );
    }

    if (input.email) {
      const exist = await db.user.findFirst({
        where: { email: input.email, id: { not: user.id } },
      });

      if (exist) {
        return c.json(
          { success: false, message: "Email already exist", result: null },
          { status: 400 },
        );
      }
    }

    await db.user.update({
      where: { id: user.id },
      data: { name: input.name, email: input.email, image: input.image },
    });

    return c.json(
      { success: true, message: "Profile update success", result: null },
      { status: 200 },
    );
  },
);

export default app;
