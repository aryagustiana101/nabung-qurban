import { Hono } from "hono";
import homeRouter from "~/routers/home-router";
import storageRouter from "~/routers/storage-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);
app.route("/storage", storageRouter);

export default app;
