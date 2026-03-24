"use client";

import Link from "next/link";

export default function AdminRoadmapPage() {
  return (
    <div className="min-h-screen bg-page p-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 bg-accent-soft text-brand-warning rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8">
          <i className="fa-solid fa-file-invoice-dollar" />
        </div>
        
        <h1 className="text-2xl font-bold text-primary mb-4">Business Admin Workspace</h1>
        <div className="inline-block px-3 py-1 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-[10px] font-bold uppercase tracking-widest rounded-full mb-8">
          Roadmap / Coming Next
        </div>
        
        <p className="text-secondary text-sm mb-12 leading-relaxed">
          Permukaan ini dirancang khusus untuk pemilik usaha guna mengelola administrasi tingkat lanjut dan dokumen pelaporan eksternal.
        </p>
        
        <div className="space-y-4 text-left mb-12">
          {[
            {
              icon: "fa-file-pdf",
              title: "Laporan Bulanan & Tahunan",
              desc: "Otomatisasi Laporan Laba/Rugi dan Posisi Keuangan standar SAK EMKM."
            },
            {
              icon: "fa-file-export",
              title: "Ekspor Data (Excel/PDF)",
              desc: "Ekspor riwayat transaksi dan ledger untuk kebutuhan internal atau audit."
            },
            {
              icon: "fa-landmark",
              title: "Pengajuan Pinjaman (Proposal)",
              desc: "Pembuatan paket dokumen 'Loan Ready' berdasarkan skor kepercayaan KasAI."
            },
            {
              icon: "fa-calculator",
              title: "Asisten Pajak",
              desc: "Kalkulasi estimasi pajak UMKM secara otomatis dari data harian."
            }
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 p-4 bg-card border border-border-subtle rounded-xl">
              <div className="text-brand-warning mt-1">
                <i className={`fa-solid ${feature.icon}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary mb-1">{feature.title}</h3>
                <p className="text-xs text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href="/"
          className="text-brand-primary text-xs font-bold flex items-center justify-center gap-2 hover:opacity-80 transition"
        >
          <i className="fa-solid fa-arrow-left" />
          KEMBALI KE BERANDA
        </Link>
      </div>
    </div>
  );
}
