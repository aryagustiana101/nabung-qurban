import { FIELD, PRODUCT_SCOPES, convertCase } from "@repo/common";
import type { SearchParams } from "nuqs";
import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { CreateProductForm } from "~/components/forms/product-form";
import { LoadingProvider } from "~/components/provider";
import { searchParamsCache } from "~/server/search-params";
import { HydrateClient, api } from "~/server/trpc";

export const metadata = { title: "Create Product" };

export default async function CreateProductPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const scope =
    FIELD.ENUM(PRODUCT_SCOPES, "scope").safeParse(
      (await searchParamsCache.parse(searchParams)).scope,
    ).data ?? "livestock";

  await api.category.getMultiple.prefetchInfinite({ pagination: "cursor" });
  await api.service.getMultiple.prefetchInfinite({
    scopes: [scope],
    levels: ["main"],
    statuses: ["active"],
    pagination: "cursor",
  });

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{
          items: [
            { href: "/dashboard", title: "Dashboard" },
            { href: "/dashboard/products", title: "Products" },
            { href: null, title: `New ${convertCase(scope)}` },
          ],
        }}
      >
        <LoadingProvider>
          <CreateProductForm scope={scope} />
        </LoadingProvider>
      </AppSidebarShell>
    </HydrateClient>
  );
}
