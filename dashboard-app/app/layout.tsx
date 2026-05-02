import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Yoshlar Ittifoqi — Qarz Monitoring",
  description: "O'zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi — Qarz monitoring tizimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
