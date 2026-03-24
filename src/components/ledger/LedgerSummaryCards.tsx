"use client";

import { useEffect, useState } from "react";
import { getLedgerSummary, LedgerSummaryData } from "@/lib/api/ledger";

export function LedgerSummaryCards() {
  const [data, setData] = useState<LedgerSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await getLedgerSummary();
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error?.message || "Gagal memuat saldo");
        }
      } catch {
        setError("Network error");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card p-6 rounded-xl shadow-sm border border-border-subtle animate-pulse">
            <div className="h-4 bg-card-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-card-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-brand-danger/10 text-brand-danger rounded-lg">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-card p-5 rounded-xl shadow-sm border-l-4 border-l-brand-primary border-t border-r border-b border-border-subtle flex justify-between items-center">
        <div>
          <h3 className="text-muted text-[10px] font-bold uppercase tracking-wider">Saldo Kas Aktif</h3>
          <p className="text-xl font-bold text-primary mt-1">
            Rp {data?.cashBalance.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-brand-primary opacity-20 text-2xl">
          <i className="fa-solid fa-wallet" />
        </div>
      </div>
      
      <div className="bg-card p-5 rounded-xl shadow-sm border-l-4 border-l-brand-warning border-t border-r border-b border-border-subtle flex justify-between items-center">
        <div>
          <h3 className="text-muted text-[10px] font-bold uppercase tracking-wider">Beban Operasional</h3>
          <p className="text-xl font-bold text-primary mt-1">
            Rp {data?.expenseTotal.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-brand-warning opacity-20 text-2xl">
          <i className="fa-solid fa-receipt" />
        </div>
      </div>

      <div className="bg-card p-5 rounded-xl shadow-sm border-l-4 border-l-brand-danger border-t border-r border-b border-border-subtle flex justify-between items-center">
        <div>
          <h3 className="text-muted text-[10px] font-bold uppercase tracking-wider">Prive (Pribadi)</h3>
          <p className="text-xl font-bold text-primary mt-1">
            Rp {data?.priveTotal.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="text-brand-danger opacity-20 text-2xl">
          <i className="fa-solid fa-user-gear" />
        </div>
      </div>
    </div>
  );
}
