import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parol", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { prisma } = await import("./lib/prisma");
        const bcrypt = (await import("bcryptjs")).default;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
          // Update last login info
          const ip = request?.headers?.get?.("x-forwarded-for")
            || request?.headers?.get?.("x-real-ip")
            || "unknown";

          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              lastLoginIp: typeof ip === "string" ? ip.split(",")[0].trim() : "unknown",
            },
          });

          // Log login action
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              amal: "Tizimga kirdi",
              turi: "LOGIN",
              ipAddress: typeof ip === "string" ? ip.split(",")[0].trim() : "unknown",
            },
          });

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
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
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      // Public pages — no auth required
      if (pathname.startsWith("/fuqaro") || pathname.startsWith("/api/fuqaro")) {
        return true;
      }

      // Login page
      if (pathname.startsWith("/login")) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
        return true;
      }

      // All other pages require login
      if (!isLoggedIn) {
        return false;
      }

      // Role-based page access check (inline to avoid edge runtime issues)
      const role = auth?.user?.role;
      if (role && role !== "SUPER_ADMIN") {
        const ROLE_PAGES: Record<string, string[]> = {
          BUXGALTER: ["/", "/debtors", "/payments", "/calendar", "/reports"],
          YURIST: ["/", "/debtors", "/documents", "/court", "/calendar"],
        };
        const allowed = ROLE_PAGES[role] || [];
        const isAllowed = allowed.some(p => pathname === p || pathname.startsWith(p + "/"));
        if (!isAllowed && !pathname.startsWith("/api/")) {
          return Response.redirect(new URL("/", request.nextUrl));
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
