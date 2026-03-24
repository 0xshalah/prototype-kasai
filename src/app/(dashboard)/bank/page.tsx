"use client";

import { useState, useEffect, useCallback } from "react";
import { BankEvidencePanel } from "@/components/dashboard/BankEvidencePanel";
import { getLedgerSummary } from "@/lib/api/ledger";
import { getScoreSnapshot } from "@/lib/api/score";
import { LedgerSummaryData } from "@/lib/api/ledger";

const formatRp = (n: number) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default function BankPage() {
  const [summary, setSummary] = useState<LedgerSummaryData>({
    cashBalance: 5_000_000,
    expenseTotal: 0,
    priveTotal: 0
  });
  const [totalScore, setTotalScore] = useState(680);
  const [panelKey, setPanelKey] = useState(0);

  const refresh = useCallback(async () => {
    const [s, sc] = await Promise.all([getLedgerSummary(), getScoreSnapshot()]);
    if (s.success && s.data)  setSummary(s.data);
    if (sc.success && sc.data) setTotalScore(sc.data.totalScore);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleResetVault = async () => {
    if (!confirm("⚠️ PERINGATAN DESTRUKTIF! ⚠️\n\nTindakan ini akan menghapus seluruh rantai blok, transaksi, dan riwayat jurnal dari database secara permanen. Lanjutkan re-inisialisasi Genesis Block?")) return;
    
    try {
      const res = await fetch("/api/audit/reset", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        // Atomic state sync — no page reload needed
        await refresh();
        setPanelKey(k => k + 1); // Force re-mount of BankEvidencePanel (clears chain + verify state)
      } else {
        alert("Gagal mereset: " + json.error?.message);
      }
    } catch(e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert("Error menghubungi server: " + msg);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1200px] mx-auto w-full space-y-6">
      {/* Top Controls & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Cash Balance",  value: formatRp(summary.cashBalance),  color: summary.cashBalance <= 0 ? "text-brand-danger" : "text-brand-success" },
            { label: "Total Expense", value: formatRp(summary.expenseTotal), color: "text-brand-warning"   },
            { label: "Total Prive",   value: formatRp(summary.priveTotal),   color: "text-brand-danger"    },
            { label: "KasAI Score",   value: String(totalScore),             color: totalScore >= 700 ? "text-brand-success" : totalScore >= 600 ? "text-brand-warning" : "text-brand-danger" },
          ].map((c) => (
            <div key={c.label} className="bg-card rounded-xl border border-border-subtle px-5 py-3 flex items-center gap-3 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-muted">{c.label}</span>
              <span className={`font-mono text-sm font-bold ${c.color}`}>{c.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Simulation Controls</span>
          <button 
            onClick={handleResetVault}
            title="Reset seluruh data demo untuk presentasi baru"
            className="bg-brand-danger/10 text-brand-danger border border-brand-danger/20 hover:bg-brand-danger hover:text-white transition-all px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider"
          >
            <i className="fa-solid fa-arrow-rotate-left mr-2"></i>
            Reset Demo State
          </button>
        </div>
      </div>

      <BankEvidencePanel key={panelKey} onRefresh={refresh} />
    </div>
  );
}
