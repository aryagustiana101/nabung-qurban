import "server-only";

import { webRouterSchema as routerSchema } from "@repo/common/schemas/auth-schema";
import { parseUser } from "@repo/database";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cache } from "react";
import { env } from "~/env";
import { APP_LOCALE, APP_TZ } from "~/lib/constants";
import { fullUrl } from "~/lib/utils";
import { db } from "~/server/db";
import { getPublicUrl } from "~/server/storage";

const {
  signIn,
  signOut,
  handlers,
  auth: uncachedAuth,
} = NextAuth({
  pages: { signIn: "/login", signOut: "/logout" },
  callbacks: {
    authorized: () => true,
    session: ({ session, token }) => ({
      user: token?.user,
      expires: session?.expires,
    }),
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = (user as { record: { user: never } })?.record?.user;
      }

      return token;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const input = routerSchema.login.safeParse(credentials).data;

        if (!input) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { status: "active", username: input.username },
        });

        if (!user) {
          return null;
        }

        const verified = await bcrypt.compare(input.password, user.password);

        if (!verified) {
          return null;
        }

        await db.userLog.create({
          data: { userId: user.id, action: "login" },
        });

        return {
          record: {
            user: {
              ...parseUser({
                user,
                timezone: APP_TZ,
                locale: APP_LOCALE,
                defaultValue: { image: getPublicUrl("static/avatar.png") },
              }),
              password: undefined,
            },
          },
        } as never;
      },
    }),
  ],
  events: {
    signOut: async (c) => {
      const user = (c as { token?: { user?: { id?: number } } })?.token?.user;

      if (user?.id) {
        await db.userLog.create({
          data: { userId: user.id, action: "logout" },
        });
      }
    },
  },
  cookies: (() => {
    const useSecureCookies = new URL(fullUrl()).protocol === "https:";

    return {
      sessionToken: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.session-token`,
      },
      callbackUrl: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.callback-url`,
      },
      csrfToken: {
        name: `${useSecureCookies ? "__Host-" : ""}${env.AUTH_COOKIE_PREFIX}.csrf-token`,
      },
      pkceCodeVerifier: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.pkce.code_verifier`,
      },
      state: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.state`,
      },
      nonce: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.nonce`,
      },
      webauthnChallenge: {
        name: `${useSecureCookies ? "__Secure-" : ""}${env.AUTH_COOKIE_PREFIX}.challenge`,
      },
    };
  })(),
  logger: {
    error: (error) => {
      const red = "\x1b[31m";
      const reset = "\x1b[0m";
      const name =
        error instanceof AuthError
          ? (error as never as { type: string }).type
          : error.name;

      if (name === "CredentialsSignin") {
        return;
      }

      console.error(`${red}[auth][error]${reset} ${name}: ${error.message}`);

      if (
        error.cause &&
        typeof error.cause === "object" &&
        "err" in error.cause &&
        error.cause.err instanceof Error
      ) {
        const { err, ...data } = error.cause;

        console.error(`${red}[auth][cause]${reset}:`, err.stack);

        if (data) {
          console.error(
            `${red}[auth][details]${reset}:`,
            JSON.stringify(data, null, 2),
          );
        }
      }

      if (error.stack) {
        console.error(error.stack.replace(/.*/, "").substring(1));
      }
    },
  },
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut, uncachedAuth };
