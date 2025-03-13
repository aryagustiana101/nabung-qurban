import { Hono } from "hono";
import authRouter from "~/routers/auth-router";
import homeRouter from "~/routers/home-router";
import storageRouter from "~/routers/storage-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);
app.route("/auth", authRouter);
app.route("/storage", storageRouter);

export default app;
