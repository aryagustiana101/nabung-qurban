import { createCallerFactory, createTRPCRouter } from "~/trpc/init";
import { attributeRouter } from "~/trpc/routers/attribute-router";
import { categoryRouter } from "~/trpc/routers/category-router";
import { dashboardRouter } from "~/trpc/routers/dashboard-router";
import { discountRouter } from "~/trpc/routers/discount-router";
import { entrantRouter } from "~/trpc/routers/entrant-router";
import { productRouter } from "~/trpc/routers/product-router";
import { serviceRouter } from "~/trpc/routers/service-router";
import { storageRouter } from "~/trpc/routers/storage-router";
import { warehouseRouter } from "~/trpc/routers/warehouse-router";

export const appRouter = createTRPCRouter({
  storage: storageRouter,
  product: productRouter,
  service: serviceRouter,
  entrant: entrantRouter,
  discount: discountRouter,
  category: categoryRouter,
  attribute: attributeRouter,
  warehouse: warehouseRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
