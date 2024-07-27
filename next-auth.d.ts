import { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
