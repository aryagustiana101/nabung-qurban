import { createCallerFactory, createTRPCRouter } from "~/trpc/init";
import { categoryRouter } from "~/trpc/routers/category-router";
import { dashboardRouter } from "~/trpc/routers/dashboard-router";
import { productRouter } from "~/trpc/routers/product-router";
import { storageRouter } from "~/trpc/routers/storage-router";

export const appRouter = createTRPCRouter({
  storage: storageRouter,
  product: productRouter,
  category: categoryRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
