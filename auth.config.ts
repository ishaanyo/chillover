import type { NextAuthConfig } from 'next-auth';

// This file is Edge-safe. No Prisma, no Bcrypt here!
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as 'ADMIN' | 'USER';
      return session;
    },
  },
  providers: [], // We leave this empty here and add it in auth.ts
} satisfies NextAuthConfig;