import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KasAI - Voice-to-Ledger Trust Console",
  description:
    "Infrastruktur Kepercayaan Untuk Ekonomi Informal. Menjembatani asymmetric information antara UMKM dan Perbankan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  page: {
                    DEFAULT: 'var(--bg-page)',
                    elevated: 'var(--bg-page-elevated)',
                  },
                  card: {
                    DEFAULT: 'var(--bg-card)',
                    muted: 'var(--bg-card-muted)',
                  },
                  border: {
                    subtle: 'var(--border-subtle)',
                    strong: 'var(--border-strong)',
                  },
                  primary: 'var(--text-primary)',
                  secondary: 'var(--text-secondary)',
                  muted: 'var(--text-muted)',
                  'on-brand': 'var(--text-on-brand)',
                  accent: {
                    soft: 'var(--accent-soft)',
                    glow: 'var(--accent-glow)',
                  },
                  brand: {
                    primary: {
                      DEFAULT: 'var(--brand-primary)',
                      hover: 'var(--brand-primary-hover)',
                    },
                    success: 'var(--brand-success)',
                    warning: 'var(--brand-warning)',
                    danger: 'var(--brand-danger)',
                    info: 'var(--brand-info)',
                  }
                }
              }
            }
          }
        `}} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-brand-primary/30">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
