import * as React from "react";
import { AppSidebarShell } from "~/components/app-sidebar";
import { DashboardGreetingSection } from "~/components/section";
import { HydrateClient, api } from "~/server/trpc";

export default async function DashboardPage() {
  await api.dashboard.greeting.prefetch();

  return (
    <HydrateClient>
      <AppSidebarShell
        breadcrumb={{ items: [{ href: null, title: "Dashboard" }] }}
      >
        <DashboardGreetingSection />
      </AppSidebarShell>
    </HydrateClient>
  );
}
