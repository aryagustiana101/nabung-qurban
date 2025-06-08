import type { SearchParams } from "nuqs";
import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { ProductTable } from "~/components/tables/product-table";
import { db } from "~/server/db";
import { searchParamsCache } from "~/server/search-params";
import { HydrateClient, api } from "~/server/trpc";

export const metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: { searchParams: Promise<SearchParams> }) {
  const input = await searchParamsCache.parse(searchParams);

  await api.product.getMultiple.prefetch(input);

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{
          items: [
            { href: "/dashboard", title: "Dashboard" },
            { href: null, title: "Products" },
          ],
        }}
      >
        <ProductTable
          input={input}
          categories={(
            await db.category.findMany({
              select: { code: true },
              orderBy: { code: "asc" },
            })
          ).map((v) => v.code)}
        />
      </AppSidebarShell>
    </HydrateClient>
  );
}
