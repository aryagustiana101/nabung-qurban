import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { env } from "~/env";
import appRouter from "~/routers/_app-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.use(logger());
app.route("/", appRouter);

app.notFound((c) => {
  return c.json(
    { success: false, message: "Not found", result: null },
    { status: 404 },
  );
});

app.onError((error, c) => {
  console.error(error);
  return c.json(
    { success: false, message: "Service unavailable", result: null },
    { status: 500 },
  );
});

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`Server is running on port ${info.port}`);
});
