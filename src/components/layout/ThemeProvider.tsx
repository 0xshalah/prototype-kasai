"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  let theme = 'home';
  if (path.startsWith('/umkm')) theme = 'umkm';
  if (path.startsWith('/bank')) theme = 'bank';

  if (path === '/') {
    return (
      <div data-theme={theme} className="flex flex-col min-h-screen bg-page text-primary transition-colors duration-300 selection:bg-accent-soft pt-12 md:pt-24">
        {children}
      </div>
    );
  }

  return (
    <div data-theme={theme} className="flex flex-col min-h-screen fade-in bg-page text-primary transition-colors duration-300">
      {/* Header */}
      <header className="bg-card border-b border-border-subtle px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-50 gap-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 bg-card-muted hover:bg-border-subtle rounded border border-border-subtle flex items-center justify-center text-muted hover:text-primary transition-colors mr-2">
            <i className="fa-solid fa-chevron-left" />
          </Link>
          <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center text-white text-sm shadow-lg">
            <i className="fa-solid fa-server" />
          </div>
          <div>
            <h1 className="font-bold text-primary leading-tight">KasAI Evidence Protocol</h1>
            <div className="flex flex-wrap gap-2 mt-1 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-full bg-brand-warning/10 border border-brand-warning/30 text-brand-warning">
                <i className="fa-solid fa-flask-vial" /> Prototype Build
              </span>
              <span className="px-2 py-1 rounded-full bg-card-muted border border-border-strong text-secondary">
                SHA-256 · SAK EMKM
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="https://www.peraturan.go.id/id/peraturan-ojk-no-29-tahun-2024" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-card-muted hover:bg-border-subtle rounded border border-border-subtle text-[10px] text-secondary transition-colors uppercase font-bold tracking-wider">
            <i className="fa-solid fa-scale-balanced text-brand-primary" /> POJK 29
          </a>
          <a href="https://web.iaiglobal.or.id/SAK-IAI/Tentang%20SAK%20EMKM" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-card-muted hover:bg-border-subtle rounded border border-border-subtle text-[10px] text-secondary transition-colors uppercase font-bold tracking-wider">
            <i className="fa-solid fa-book text-blue-500" /> SAK EMKM
          </a>
          <a href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final" target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-card-muted hover:bg-border-subtle rounded border border-border-subtle text-[10px] text-secondary transition-colors uppercase font-bold tracking-wider">
            <i className="fa-solid fa-lock text-brand-warning" /> NIST FIPS 180-4
          </a>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-card border-b border-border-subtle px-4 sm:px-6 pt-4 transition-colors duration-300">
        <nav className="max-w-[1200px] mx-auto flex">
          {[
            { href: "/umkm", label: "1. Input Experience (UMKM)", icon: "fa-store" },
            { href: "/bank", label: "2. Outcome & Trust (Bank)", icon: "fa-building-columns" },
          ].map((t) => {
            const active = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-6 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${active ? "border-brand-primary text-brand-primary" : "border-transparent text-muted hover:text-primary"
                  }`}
              >
                <i className={`fa-solid ${t.icon}`} />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}

      {/* Prototype Footer */}
      <footer className="bg-card border-t border-border-subtle py-6 px-4 sm:px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-muted leading-relaxed">
            Prototype interaktif dengan data demo terkontrol dan skenario simulasi.
          </p>
          <p className="text-[10px] font-mono text-muted whitespace-nowrap">
            KasAI Prototype v1.0 · Hackathon Submission · Demonstration environment for technical evaluation
          </p>
        </div>
      </footer>
    </div>
  );
}
