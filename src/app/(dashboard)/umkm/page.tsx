"use client";

import { useState, useCallback } from "react";
import { UmkmFlowPanel } from "@/components/dashboard/UmkmFlowPanel";
import { LiveFinancePanel } from "@/components/dashboard/LiveFinancePanel";
import { getLedgerSummary } from "@/lib/api/ledger";
import { LedgerSummaryData } from "@/lib/api/ledger";
import Link from "next/link";

export default function UmkmPage() {
  const [summary, setSummary] = useState<LedgerSummaryData>({
    cashBalance: 5_000_000,
    expenseTotal: 0,
    priveTotal: 0
  });

  const refresh = useCallback(async () => {
    const res = await getLedgerSummary();
    if (res.success && res.data) setSummary(res.data);
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-lg mx-auto w-full min-h-screen flex flex-col">
      <UmkmFlowPanel
        onCommitSuccess={refresh}
        onSwitchToBank={() => window.location.href = "/bank"}
      />

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Ringkasan Saldo</h3>
          </div>
          <Link href="/bank" className="text-xs text-brand-primary hover:opacity-80 flex items-center gap-1 transition">
            Buka Konsol Auditor →
          </Link>
        </div>
        <LiveFinancePanel />
      </section>
    </div>
  );
}
