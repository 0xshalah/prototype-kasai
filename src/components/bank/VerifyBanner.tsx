"use client";

interface VerifyBannerProps {
  status: "idle" | "verifying" | "pass" | "fail" | "error";
  message?: string;
  tamperedBlockIndex?: number | null;
}

export function VerifyBanner({ status, message, tamperedBlockIndex }: VerifyBannerProps) {
  if (status === "idle") return null;

  if (status === "verifying") {
    return (
      <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-4 rounded-xl flex items-center gap-3 animate-pulse">
        <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="font-medium">Melakukan verifikasi kriptografi SHA-256 dan Relasional...</span>
      </div>
    );
  }

  if (status === "pass") {
    return (
      <div className="bg-brand-success/10 border border-brand-success/20 text-brand-success p-4 rounded-xl flex items-center gap-3">
        <div className="bg-brand-success/20 p-2 rounded-full">
          <svg className="w-6 h-6 text-brand-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-brand-success">Chain Aman & Terverifikasi</h3>
          <p className="text-sm mt-1">{message || "Tidak ditemukan anomali atau intrusi data pada Hash Chain maupun Ledger Transaksi."}</p>
        </div>
      </div>
    );
  }

  if (status === "fail") {
    return (
      <div className="bg-brand-danger/10 border border-brand-danger/20 text-brand-danger p-4 rounded-xl flex items-center gap-3 shadow-sm">
        <div className="bg-brand-danger/20 p-2 rounded-full">
          <svg className="w-6 h-6 text-brand-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-brand-danger">INTEGRITAS DATA TERKOMPROMI!</h3>
          <p className="text-sm mt-1 font-medium">{message}</p>
          <p className="text-xs mt-2 bg-brand-danger/20 inline-block px-2 py-1 rounded text-brand-danger font-mono">
            Bukti Manipulasi Terdeteksi pada Block #{tamperedBlockIndex}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-muted border border-border-subtle text-primary p-4 rounded-xl flex items-center gap-3">
       <span className="font-medium">{message || "Terjadi kesalahan internal sistem."}</span>
    </div>
  );
}
