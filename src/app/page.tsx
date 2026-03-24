"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 z-10 pb-20">
      
      {/* Light Blur Ornament (Allowed by Spec) - Much more subtle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-accent-soft rounded-full blur-[100px] pointer-events-none -z-10 opacity-60" />

      <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
        {/* Verification Status Badge - Thin, small, non-blinking */}
        <div
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-card-muted/50 border border-border-subtle text-muted text-[10px] sm:text-xs font-medium mb-8 tracking-wider uppercase fade-in"
        >
          Submission · Hackathon PIDI DIGDAYA 2026
        </div>

        {/* Headline - Solid Trust-First color, no huge neon gradient */}
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-primary slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Infrastruktur Kepercayaan
          <br />
          <span className="text-secondary text-3xl md:text-5xl font-medium mt-2 block">
            Untuk Ekonomi Informal.
          </span>
        </h1>

        {/* Subline - Human readable, benefit driven */}
        <p
          className="text-base md:text-lg text-secondary max-w-3xl mx-auto mb-10 font-normal leading-relaxed slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          KasAI membantu UMKM mencatat transaksi cukup dengan berbicara, mengubahnya menjadi ledger yang konsisten dengan SAK EMKM, menghasilkan sinyal kelayakan usaha, dan menyediakan jejak audit yang dapat diverifikasi.
        </p>

        {/* Mini-proof strip (Scan-friendly) */}
        <div className="flex flex-wrap justify-center gap-3 mb-14 slide-up" style={{ animationDelay: "0.25s" }}>
           <span className="px-3 py-1.5 bg-card/60 rounded-md border border-border-subtle text-xs text-primary font-medium flex items-center gap-2 shadow-sm">
             <i className="fa-solid fa-microphone text-brand-primary opacity-80" /> Voice-first capture
           </span>
           <span className="px-3 py-1.5 bg-card/60 rounded-md border border-border-subtle text-xs text-primary font-medium flex items-center gap-2 shadow-sm">
             <i className="fa-solid fa-shield-halved text-brand-info opacity-80" /> Deterministic guardrails
           </span>
           <span className="px-3 py-1.5 bg-card/60 rounded-md border border-border-subtle text-xs text-primary font-medium flex items-center gap-2 shadow-sm">
             <i className="fa-solid fa-lock text-brand-warning opacity-80" /> Tamper-evident trail
           </span>
        </div>

        {/* The Three Surfaces of KasAI - NEW SECTION */}
        <div className="mb-20 slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-2xl font-bold text-primary mb-10">Ekosistem Multi-Surface</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "fa-mobile-screen-button",
                role: "UMKM Companion",
                title: "Input Cepat & Voice-First",
                desc: "Simulasi mobile app untuk pedagang. Fokus pada input suara, otomasi jurnal, dan cek saldo instan.",
                href: "/umkm",
                colorClass: "text-brand-primary",
                bgClass: "bg-accent-soft",
                label: "Mulai Mencatat"
              },
              {
                icon: "fa-server",
                role: "Evidence Console",
                title: "Audit & Underwriting",
                desc: "Dashboard desktop untuk Bank dan Auditor. Verifikasi transparansi, ACS, dan jejak audit blockchain.",
                href: "/bank",
                colorClass: "text-brand-info",
                bgClass: "bg-accent-soft",
                label: "Buka Konsol Auditor"
              },
              {
                icon: "fa-file-invoice-dollar",
                role: "Business Admin",
                title: "Laporan & Dokumen Pendaftaran",
                desc: "Roadmap: Workspace untuk pemilik usaha mengelola laporan bulanan, ekspor PDF/Excel, dan pengajuan pajak.",
                href: "/admin",
                colorClass: "text-brand-warning",
                bgClass: "bg-accent-soft",
                label: "Lihat Roadmap"
              }
            ].map((s, i) => (
              <div
                key={i}
                className="bg-card flex flex-col items-start text-left border border-border-subtle p-6 rounded-2xl hover:border-border-strong transition-all hover:shadow-lg group"
              >
                <div className={`w-10 h-10 ${s.bgClass} ${s.colorClass} rounded-lg flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform border border-border-subtle`}>
                  <i className={`fa-solid ${s.icon}`} />
                  <span className="sr-only">Icon</span>
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${s.colorClass} mb-1`}>{s.role}</div>
                <h3 className="text-primary font-bold mb-3 text-base leading-snug">{s.title}</h3>
                <p className="text-xs text-secondary leading-relaxed mb-6">{s.desc}</p>
                
                <Link
                  href={s.href}
                  className="mt-auto w-full py-2.5 rounded-lg border border-border-subtle text-xs font-bold text-center transition-colors hover:bg-card-muted text-primary"
                >
                  {s.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Hero CTA - Simpler and direct */}
        <div className="slide-up flex flex-col items-center gap-6" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link
              href="/umkm"
              className="flex-1 px-8 py-4 bg-brand-primary hover:opacity-90 text-on-brand text-sm font-bold rounded-xl shadow-lg shadow-brand-primary/20 transition-all text-center"
            >
              Mencatat Sebagai UMKM
            </Link>
            <Link
              href="/bank"
              className="flex-1 px-8 py-4 bg-card border border-border-subtle hover:border-border-strong text-primary text-sm font-bold rounded-xl transition-all text-center"
            >
              Portal Auditor & Bank
            </Link>
          </div>
          <p className="text-[11px] text-muted max-w-xs mx-auto">
            Gunakan data demo untuk mensimulasikan alur pencatatan suara hingga verifikasi audit trail.
          </p>
        </div>
      </div>
    </div>
  );
}
