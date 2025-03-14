import { Hono } from "hono";
import { protect } from "~/lib/middleware";
import authRouter from "~/routers/auth-router";
import homeRouter from "~/routers/home-router";
import meRouter from "~/routers/me-router";
import storageRouter from "~/routers/storage-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);
app.route("/auth", authRouter);
app.route("/storage", storageRouter);
app.use("/me", protect).route("/me", meRouter);

export default app;
