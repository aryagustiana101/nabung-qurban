import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { CreateProductForm } from "~/components/forms/product-form";
import { HydrateClient, api } from "~/server/trpc";

export const metadata = { title: "Create Product" };

export default async function CreateProductPage() {
  await api.category.getMultiple.prefetch({ pagination: "cursor" });

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{
          items: [
            { href: "/dashboard", title: "Dashboard" },
            { href: "/dashboard/products", title: "Products" },
            { href: null, title: "New" },
          ],
        }}
      >
        <CreateProductForm />
      </AppSidebarShell>
    </HydrateClient>
  );
}
