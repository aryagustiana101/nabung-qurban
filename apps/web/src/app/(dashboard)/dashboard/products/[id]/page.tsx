import { notFound } from "next/navigation";
import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { UpdateProductForm } from "~/components/forms/product-form";
import { HydrateClient, api } from "~/server/trpc";

export const metadata = { title: "Update Product" };

export default async function UpdateProductPage({
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

  await api.category.getMultiple.prefetch({ pagination: "cursor" });

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{
          items: [
            { href: "/dashboard", title: "Dashboard" },
            { href: "/dashboard/products", title: "Products" },
            { href: null, title: "Detail" },
          ],
        }}
      >
        <UpdateProductForm product={product} />
      </AppSidebarShell>
    </HydrateClient>
  );
}
