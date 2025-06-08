"use client";

import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-bold text-4xl">500</h1>
          <p className="text-balance text-muted-foreground text-sm">
            An error occurred while processing your request
          </p>
        </div>
        <Link href="/" className={buttonVariants({ className: "w-fit" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
