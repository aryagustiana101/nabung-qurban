import { Hono } from "hono";
import { protect } from "~/lib/middleware";
import authRouter from "~/routers/auth-router";
import homeRouter from "~/routers/home-router";
import profileRouter from "~/routers/profile-router";
import storageRouter from "~/routers/storage-router";
import userAddressRouter from "~/routers/user-address-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);
app.route("/auth", authRouter);
app.route("/storage", storageRouter);

app
  .use(protect)
  .route("/me", profileRouter)
  .route("/addresses", userAddressRouter);

export default app;
