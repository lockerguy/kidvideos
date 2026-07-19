import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, familyId: true, role: true },
      });
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.familyId = dbUser.familyId;
        session.user.role = dbUser.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
};
