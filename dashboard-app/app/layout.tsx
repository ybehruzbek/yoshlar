import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoshlar Ittifoqi — Qarz Monitoring",
  description: "O'zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi — Qarz monitoring tizimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
