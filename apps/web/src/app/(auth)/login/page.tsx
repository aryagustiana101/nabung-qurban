import type { SearchParams } from "nuqs/server";
import * as React from "react";
import { LoginForm } from "~/components/forms/auth-form";
import { Card, CardContent } from "~/components/ui/card";
import { searchParamsCache } from "~/server/search-params";

export const metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const input = await searchParamsCache.parse(searchParams);

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-bold text-2xl">Login to your account</h1>
          <p className="text-balance text-muted-foreground text-sm">
            Enter your credentials below to sign in to your account
          </p>
        </div>
        <Card>
          <CardContent>
            <LoginForm
              redirect={input.from ? decodeURIComponent(input.from) : null}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
