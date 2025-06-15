import { convertCase } from "@repo/common";
import { notFound } from "next/navigation";
import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { UpdateProductForm } from "~/components/forms/product-form";
import { LoadingProvider } from "~/components/provider";
import { HydrateClient, api } from "~/server/trpc";

export const metadata = { title: "Detail Product" };

export default async function DetailProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const input = await params;
  const id = !Number.isNaN(Number(input.id)) ? Number(input.id) : null;

  const product = id ? (await api.product.getSingle({ id }))?.result : null;

  if (!product) {
    return notFound();
  }

  await api.entrant.getMultiple.prefetchInfinite({ pagination: "cursor" });
  await api.category.getMultiple.prefetchInfinite({ pagination: "cursor" });
  await api.warehouse.getMultiple.prefetchInfinite({
    statuses: ["active"],
    pagination: "cursor",
  });
  await api.attribute.getMultiple.prefetchInfinite({
    statuses: ["active"],
    pagination: "cursor",
    scopes: [product.scope],
  });
  await api.discount.getMultiple.prefetchInfinite({
    pagination: "cursor",
    levels: ["product_variant"],
  });
  await api.service.getMultiple.prefetchInfinite({
    levels: ["main"],
    statuses: ["active"],
    pagination: "cursor",
    scopes: [product.scope],
  });

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{
          items: [
            { href: "/dashboard", title: "Dashboard" },
            { href: "/dashboard/products", title: "Products" },
            { href: null, title: `${convertCase(product.scope)} Detail` },
          ],
        }}
      >
        <LoadingProvider>
          <UpdateProductForm product={product} />
        </LoadingProvider>
      </AppSidebarShell>
    </HydrateClient>
  );
}
