import { Hono } from "hono";
import { protect } from "~/lib/middleware";
import authRouter from "~/routers/auth-router";
import categoryRouter from "~/routers/category-router";
import homeRouter from "~/routers/home-router";
import productRouter from "~/routers/product-router";
import profileRouter from "~/routers/profile-router";
import serviceRouter from "~/routers/service-router";
import storageRouter from "~/routers/storage-router";
import userAddressRouter from "~/routers/user-address-router";
import userApplicationRouter from "~/routers/user-application-router";
import warehouseRouter from "~/routers/warehouse-router";
import type { Env } from "~/types";

const app = new Hono<Env>();

app.route("/", homeRouter);
app.route("/auth", authRouter);
app.route("/storage", storageRouter);

app.route("/services", serviceRouter);
app.route("/products", productRouter);
app.route("/categories", categoryRouter);
app.route("/warehouses", warehouseRouter);

app.on(
  ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  ["/me", "/addresses/:id?", "/applications/:id?"],
  protect,
);

app.route("/me", profileRouter);
app.route("/addresses", userAddressRouter);
app.route("/applications", userApplicationRouter);

export default app;
