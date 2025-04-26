import { createCallerFactory, createTRPCRouter } from "~/trpc/init";
import { storageRouter } from "~/trpc/routers/storage-router";

export const appRouter = createTRPCRouter({
  storage: storageRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
