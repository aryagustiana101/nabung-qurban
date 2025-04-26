import "~/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Provider } from "~/components/provider";
import { site } from "~/lib/constants";
import { cn, fullUrl } from "~/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(fullUrl()),
  title: { default: site.name, template: `%s - ${site.name}` },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
