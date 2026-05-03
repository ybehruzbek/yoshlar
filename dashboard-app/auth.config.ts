import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Public pages — no auth required
      if (pathname.startsWith("/fuqaro") || pathname.startsWith("/api/fuqaro")) {
        return true;
      }

      // Login page
      if (pathname.startsWith("/login")) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // All other pages require login
      if (!isLoggedIn) {
        return false;
      }

      // Role-based page access check
      const role = auth?.user?.role;
      if (role && role !== "SUPER_ADMIN") {
        const ROLE_PAGES: Record<string, string[]> = {
          BUXGALTER: ["/", "/debtors", "/payments", "/calendar", "/reports"],
          YURIST: ["/", "/debtors", "/documents", "/court", "/calendar"],
        };
        const allowed = ROLE_PAGES[role] || [];
        const isAllowed = allowed.some(p => pathname === p || pathname.startsWith(p === "/" ? "////" : p + "/"));
        if (!isAllowed && !pathname.startsWith("/api/")) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
