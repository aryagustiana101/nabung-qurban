import { createCallerFactory, createTRPCRouter } from "~/trpc/init";
import { dashboardRouter } from "~/trpc/routers/dashboard-router";
import { productRouter } from "~/trpc/routers/product-router";
import { storageRouter } from "~/trpc/routers/storage-router";

export const appRouter = createTRPCRouter({
  storage: storageRouter,
  product: productRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
