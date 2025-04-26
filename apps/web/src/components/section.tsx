"use client";

import { api } from "~/components/provider";

export function DashboardGreetingSection() {
  const query = api.dashboard.greeting.useQuery();

  return (
    <h1 className="scroll-m-20 font-semibold text-2xl tracking-tight">
      {query?.data?.result?.greeting ?? "Loading..."}
    </h1>
  );
}
