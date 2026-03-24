"use client";

import { LedgerSummaryCards } from "@/components/ledger/LedgerSummaryCards";

export function LiveFinancePanel() {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Saldo Ledger Aktual</h2>
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-success"></span>
        </span>
      </div>
      <LedgerSummaryCards />
      <p className="mt-3 text-xs text-muted flex items-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Nilai terbarui otomatis setiap transaksi berhasil masuk Ledger.
      </p>
    </div>
  );
}

