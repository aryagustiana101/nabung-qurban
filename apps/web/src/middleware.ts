import { routeParams } from "@repo/common";
import { qs } from "@repo/common";
import { type NextRequest, NextResponse } from "next/server";
import { fullUrl } from "~/lib/utils";
import type { User } from "~/types";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookie = req.headers.get("cookie");
  const user = cookie ? await getUser(cookie) : null;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(user ? "/dashboard" : "/login", req.url),
      req,
    );
  }

  if (
    !user &&
    resolveRouteRecord(pathname, ["/logout", "/dashboard", "/dashboard/*path"])
  ) {
    return NextResponse.redirect(
      new URL(
        `/login?${qs.stringify({
          from: encodeURIComponent(`${pathname}${req.nextUrl.search}`),
        })}`,
        req.url,
      ),
      req,
    );
  }

  if (
    user &&
    user.type === "external" &&
    resolveRouteRecord(pathname, ["/dashboard", "/dashboard/*path"])
  ) {
    return NextResponse.redirect(new URL("/logout", req.url), req);
  }

  if (user && resolveRouteRecord(pathname, ["/login"])) {
    return NextResponse.redirect(new URL("/dashboard", req.url), req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\..*).*)",
  ],
};

async function getUser(cookie: string) {
  try {
    const output = await fetch(fullUrl("/api/me"), {
      method: "GET",
      headers: { Accept: "application/json", cookie },
    });

    return ((await output.json()) as { result?: User | null })?.result ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function resolveRouteRecord(pathname: string, routes: string[]) {
  return routes.some((value) =>
    [":", "*"].some((char) => value.includes(char))
      ? Object.keys(routeParams(value, pathname)).length > 0
      : value === pathname,
  );
}
