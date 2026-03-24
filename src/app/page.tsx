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

        {/* Proof Pillars (Features) - Solid Surfaces, no glassmorphism */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            {
              icon: "fa-book-open",
              title: "Pencatatan yang Konsisten dengan SAK EMKM",
              desc: "Ucapan transaksi diterjemahkan menjadi jurnal terstruktur dengan guardrail akuntansi, termasuk pemisahan uang usaha dan uang pribadi.",
            },
            {
              icon: "fa-scale-balanced",
              title: "Sinyal Kelayakan untuk Pembiayaan",
              desc: "Data transaksi harian diolah menjadi underwriting signal yang transparan dan terfaktorisasi untuk membantu pembacaan kondisi usaha secara lebih objektif.",
            },
            {
              icon: "fa-link",
              title: "Jejak Audit yang Dapat Diverifikasi",
              desc: "Setiap transaksi ditautkan ke audit trail berbasis hash sehingga perubahan setelah pencatatan dapat dideteksi saat proses verifikasi.",
            },
          ].map((p, i) => (
            <div
              key={i}
              className="bg-card flex flex-col items-center text-center border border-border-subtle p-8 rounded-2xl hover:border-border-strong transition-colors"
            >
              <div className="w-12 h-12 bg-accent-soft text-brand-primary rounded-full flex items-center justify-center text-xl mb-5">
                <i className={`fa-solid ${p.icon}`} />
              </div>
              <h3 className="text-primary font-bold mb-3 text-lg leading-snug">{p.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="slide-up flex flex-col items-center gap-4" style={{ animationDelay: "0.4s" }}>
          <Link
            href="/umkm"
            className="px-8 py-4 bg-brand-primary hover:bg-brand-primary-hover text-on-brand text-base font-bold rounded-xl shadow-lg shadow-brand-primary/20 transition-all inline-flex items-center gap-3"
          >
            Lihat Evidence Console
            <i className="fa-solid fa-arrow-right" />
          </Link>
          <p className="text-xs text-muted mt-2">
            Prototype interaktif dengan data demo terkontrol dan skenario simulasi.
          </p>
        </div>
      </div>
    </div>
  );
}
