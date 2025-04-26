import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { APP_ENV } from "~/lib/constants";
import { createTRPCContext } from "~/trpc/init";
import { appRouter } from "~/trpc/routers/_app-router";

const createContext = async (req: NextRequest) => {
  return createTRPCContext({ headers: req.headers });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createContext(req),
    onError:
      APP_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
