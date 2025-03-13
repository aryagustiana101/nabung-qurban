import { Hono } from "hono";
import homeRouter from "~/routers/home-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);

export default app;
