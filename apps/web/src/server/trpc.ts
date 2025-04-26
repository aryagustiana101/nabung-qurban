import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";
import { createTRPCContext } from "~/trpc/init";
import { makeQueryClient } from "~/trpc/query-client";
import { type AppRouter, createCaller } from "~/trpc/routers/_app-router";

const createContext = async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  return createTRPCContext({ headers: heads });
};

const caller = createCaller(createContext);
const getQueryClient = cache(makeQueryClient);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
