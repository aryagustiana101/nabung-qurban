"use client";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createTRPCReact,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import * as React from "react";
import superjson from "superjson";
import { Toaster } from "~/components/ui/sonner";
import { LoadingContext } from "~/hooks/use-loading";
import { APP_ENV } from "~/lib/constants";
import { fullUrl } from "~/lib/utils";
import { makeQueryClient } from "~/trpc/query-client";
import type { AppRouter } from "~/trpc/routers/_app-router";

let clientQueryClientSingleton: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  // biome-ignore lint/suspicious/noAssignInExpressions:Ignore assign in expression
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export const api = createTRPCReact<AppRouter>();

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = React.useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            APP_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: superjson,
          url: fullUrl("/api/trpc"),
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </api.Provider>
    </QueryClientProvider>
  );
}

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <TRPCProvider>
      <SessionProvider>
        <NuqsAdapter>
          <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            <TopLoader />
            {children}
            <Toaster />
            {APP_ENV === "production" ||
            process?.env?.NODE_ENV === "production" ? null : (
              <div className="fixed right-1 bottom-1 z-[999] flex size-8 items-center justify-center rounded-full bg-neutral-950 p-3 font-mono text-neutral-50 text-xs dark:bg-neutral-50 dark:text-neutral-950">
                <div className="sm:hidden">xs</div>
                <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
                  sm
                </div>
                <div className="hidden md:block lg:hidden xl:hidden 2xl:hidden">
                  md
                </div>
                <div className="hidden lg:block xl:hidden 2xl:hidden">lg</div>
                <div className="hidden xl:block 2xl:hidden">xl</div>
                <div className="hidden 2xl:block">2xl</div>
              </div>
            )}
          </ThemeProvider>
        </NuqsAdapter>
      </SessionProvider>
    </TRPCProvider>
  );
}

function TopLoader() {
  const { theme, systemTheme } = useTheme();
  const [isMounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return isMounted ? (
    <NextTopLoader
      showSpinner={false}
      color={
        theme === "dark" || (theme === "system" && systemTheme === "dark")
          ? "#E5E5E5"
          : "#171717"
      }
    />
  ) : null;
}

export function LoadingProvider({ children }: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
