import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { ZodError } from "zod";
import { APP_CURRENCY, APP_LOCALE, APP_TZ } from "~/lib/constants";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type RouterContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const createTRPCContext = cache(
  async ({ headers }: { headers: Headers }) => {
    return {
      db,
      headers,
      timezone: APP_TZ,
      locale: APP_LOCALE,
      session: await auth(),
      currency: APP_CURRENCY,
    };
  },
);

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { session: { ...ctx.session, user: ctx.session.user } } });
});
