import { Hono } from "hono";
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
    { success: true, message: null, result: user },
    { status: 200 },
  );
});

export default app;
