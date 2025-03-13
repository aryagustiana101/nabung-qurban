import { Hono } from "hono";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.get("/", async (c) => {
  return c.json(
    { success: true, message: "Hello world!", result: null },
    { status: 200 },
  );
});

export default app;
