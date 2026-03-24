"use client";

import { useCallback } from "react";
import { UmkmFlowPanel } from "@/components/dashboard/UmkmFlowPanel";
import { LiveFinancePanel } from "@/components/dashboard/LiveFinancePanel";
import { getLedgerSummary } from "@/lib/api/ledger";
import Link from "next/link";

export default function UmkmPage() {

  const refresh = useCallback(async () => {
    await getLedgerSummary(); // trigger upstream refresh
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full min-h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-primary">Terminal KasAI UMKM</h2>
          <p className="text-sm text-secondary mt-1">Rekam transaksi bisnismu menggunakan suara atau ketikan natural.</p>
        </div>
        <Link 
          href="/bank" 
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-card-muted hover:bg-border-subtle border border-border-subtle rounded-lg text-sm font-bold text-primary transition-colors group"
        >
          <i className="fa-solid fa-server text-brand-info group-hover:scale-110 transition-transform" />
          Buka Konsol Auditor
          <i className="fa-solid fa-arrow-right text-muted group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Resolution */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <UmkmFlowPanel
            onCommitSuccess={refresh}
            onSwitchToBank={() => window.location.href = "/bank"}
          />
        </div>

        {/* Right Column: Fast Balances */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <Link 
            href="/bank" 
            className="sm:hidden flex items-center justify-between p-4 bg-card-muted hover:bg-border-subtle border border-border-subtle rounded-xl text-sm font-bold text-primary transition-colors group"
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-server text-brand-info" />
              Buka Konsol Auditor
            </div>
            <i className="fa-solid fa-arrow-right text-muted group-hover:translate-x-1 transition-transform" />
          </Link>
          <LiveFinancePanel />
        </div>
      </div>
    </div>
  );
}
