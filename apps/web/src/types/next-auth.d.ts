// biome-ignore lint/correctness/noUnusedImports: Needed to load the types
import NextAuth, { type DefaultSession } from "next-auth";
// biome-ignore lint/correctness/noUnusedImports: Needed to load the types
import { JWT } from "next-auth/jwt";
import type { User } from "~/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
