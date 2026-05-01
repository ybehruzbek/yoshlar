import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yoshlar Ittifoqi — Qarz Monitoring",
  description: "O'zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi — Qarz monitoring tizimi",
};

import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  theme = 'dark';
                }
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

