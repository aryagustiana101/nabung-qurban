import { redirect } from "next/navigation";
import type * as React from "react";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { getPublicUrl } from "~/server/storage";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user ?? null;

  if (!user) {
    return redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        logo={{ alt: "Logo", src: getPublicUrl("/static/logo.png") }}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
